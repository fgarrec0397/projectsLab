import { InjectQueue } from "@nestjs/bull";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { CacheService } from "src/common/cache/cache.service";
import { FileSystem } from "src/common/FileSystem";
import { VideoUtils } from "src/common/utils/video.utils";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { getVideoByIdCacheKey, getVideosCacheKey } from "../../videos/utils/videos.utils";
import { IVideo, VideoStatus } from "../../videos/videos.types";
import { VideoEventsGateway } from "../gateways/video-events.gateway";
import {
    Script,
    ScriptGeneratorService,
} from "../submodules/script-generator/script-generator.service";
import {
    InjectTemplateGenerator,
    TemplateGeneratorService,
} from "../submodules/template-generator/template-generator.service";
import { VideoRendererService } from "../submodules/video-renderer/video-renderer.service";
import { Template } from "../submodules/video-renderer/video-renderer.types";

const canGenerateScript = true;
const canGenerateTemplate = true;
const canRenderVideo = true;

@Injectable()
export class VideoProcessingService {
    constructor(
        @InjectQueue("video-rendering") private videoRenderingQueue: Queue,
        private readonly scriptService: ScriptGeneratorService,
        @InjectTemplateGenerator() private readonly templateService: TemplateGeneratorService,
        private readonly eventsGateway: VideoEventsGateway,
        @InjectDatabase() private readonly database: DatabaseConfig,
        @InjectStorageConfig() private readonly storage: StorageConfig,
        private readonly cacheService: CacheService
    ) {}

    async test(userId: string, video: IVideo) {
        console.log({ userId, video }, "test");
        console.log(this.videoRenderingQueue, "this.videoRenderingQueue");

        this.videoRenderingQueue.on("completed", (job, result) => {
            console.log(`Job completed: ${job.id}`);
        });

        this.videoRenderingQueue.on("failed", (job, err) => {
            console.log(`Job failed: ${job.id}`, err);
        });

        this.videoRenderingQueue.on("error", (err) => {
            console.log("A queue error occurred:", err);
        });

        this.videoRenderingQueue.on("active", (job) => {
            console.log(`Job started: ${job.id}`);
        });
        await this.videoRenderingQueue.add("render-video", {
            userId,
            video,
        });
    }

    async renderVideo(userId: string, video: IVideo) {
        console.log("renderVideo");

        const thumbnailFolder = FileSystem.getTempFolderPath("thumbnails");
        const finalVoiceTempFolder = FileSystem.getTempFolderPath("final-voice-generation");
        const speechFilePath = `${finalVoiceTempFolder.tempFolderPath}/speech.mp3`;

        let script: Script = {};
        let template: Template | undefined = undefined;

        if (canGenerateScript) {
            await this.notifyClient(userId, video, VideoStatus.GeneratingScript);

            script = await this.scriptService.generateScript(speechFilePath);
        }

        if (canGenerateTemplate) {
            await this.notifyClient(userId, video, VideoStatus.GeneratingTemplate);

            this.templateService.prepareTemplate(script, speechFilePath);

            template = await this.templateService.createTemplate();

            if (!template) {
                throw new HttpException(
                    "An issue happened and the template was not generated",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }

        try {
            if (!canRenderVideo) {
                return;
            }

            if (template) {
                await this.notifyClient(userId, video, VideoStatus.Rendering);

                const videoRenderer = new VideoRendererService(template);

                await videoRenderer.initRender(async (videoPath) => {
                    try {
                        const videoFileName = `system/${userId}/videos/${video.name}.mp4`;
                        const thumbnailFileName = `system/${userId}/thumbnails/${video.name}.jpg`;
                        const thumbnailPath = `${thumbnailFolder.tempFolderPath}/${video.name}.jpg`;

                        await FileSystem.createDirectory(thumbnailFolder.tempFolderPath);

                        await this.processingThumnail(
                            videoPath,
                            thumbnailFolder.tempFolderPath,
                            `${video.name}.jpg`,
                            [135, 240]
                        );

                        const duration = await VideoUtils.getVideoDuration(videoPath);

                        await this.storage.uploadFile(thumbnailPath, thumbnailFileName);
                        await this.storage.uploadFile(videoPath, videoFileName);

                        await this.notifyClient(
                            userId,
                            {
                                ...video,
                                videoKey: videoFileName,
                                thumbnail: thumbnailFileName,
                                duration,
                            },
                            VideoStatus.Rendered
                        );
                    } catch (error) {
                        throw new HttpException(
                            "The generate video was not uploaded successfully to the storage provider",
                            HttpStatus.INTERNAL_SERVER_ERROR
                        );
                    }
                });

                await finalVoiceTempFolder.cleanUp();
                await thumbnailFolder.cleanUp();

                return { result: "Video created" };
            }

            throw new HttpException(
                "An issue happened and the video was not generated",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        } catch (error) {
            throw new HttpException(error as Record<string, any>, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async notifyClient(userId: string, video: IVideo, status: VideoStatus) {
        const videoCollectionPath = `users/${userId}/videos`;
        const newVideo: IVideo = {
            ...video,
            status,
        };

        console.log({ status }, "notifyClient");

        await this.database.update(videoCollectionPath, video.id, newVideo);

        this.cacheService.invalidate(getVideosCacheKey(userId), video);
        this.cacheService.invalidate(getVideoByIdCacheKey(video.id), video);

        this.eventsGateway.notifyVideoProcessStep(newVideo);
    }

    private async processingThumnail(
        videoPath: string,
        outputFolder: string,
        thumbnailFileName: string,
        size: [number, number],
        position?: string
    ) {
        await VideoUtils.generateThumbnail(
            videoPath,
            outputFolder,
            thumbnailFileName,
            size,
            position
        );
    }
}
