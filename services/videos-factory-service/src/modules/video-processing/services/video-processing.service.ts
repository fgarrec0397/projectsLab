import { Injectable } from "@nestjs/common";
import { FileSystemService } from "src/common/files-system/services/file-system.service";
import { TempFoldersService } from "src/common/files-system/services/temp-folders.service";
import { VideoUtils } from "src/common/utils/video.utils";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";
import { NotificationsService } from "src/modules/notifications/services/notifications.service";

import { getVideoByIdCacheKey, getVideosCacheKey } from "../../videos/utils/videos.utils";
import { IVideo, VideoStatus } from "../../videos/videos.types";
import {
    Script,
    ScriptGeneratorService,
} from "../submodules/script-generator/script-generator.service";
import { TemplateGeneratorService } from "../submodules/template-generator/template-generator.service";
import { VideoRendererService } from "../submodules/video-renderer/video-renderer.service";
import { Template } from "../submodules/video-renderer/video-renderer.types";

const canGenerateScript = true;
const canGenerateTemplate = true;
const canRenderVideo = true;

@Injectable()
export class VideoProcessingService {
    constructor(
        private readonly scriptService: ScriptGeneratorService,
        private readonly templateService: TemplateGeneratorService,
        private readonly notificationService: NotificationsService,
        private readonly tempFoldersService: TempFoldersService,
        private readonly fileSystem: FileSystemService,
        @InjectDatabase() private readonly database: DatabaseConfig,
        @InjectStorageConfig() private readonly storage: StorageConfig
    ) {}

    async renderVideo(userId: string, video: IVideo) {
        const videoRenderingFolder = this.tempFoldersService.getTempFolderPath(
            this.tempFoldersService.videoRenderingFolder,
            userId
        );
        const thumbnailFolder = this.tempFoldersService.getTempFolderPath(
            this.tempFoldersService.thumbnailFolder,
            userId
        );
        const finalVoiceFolder = this.tempFoldersService.getTempFolderPath(
            this.tempFoldersService.finalVoiceGenerationFolder,
            userId
        );
        const speechFilePath = `${finalVoiceFolder.tempFolderPath}/speech.mp3`;

        let script: Script = {};
        let template: Template | undefined = undefined;

        await this.fileSystem.createDirectory(videoRenderingFolder.tempFolderPath);

        if (canGenerateScript) {
            await this.notifyClient(userId, video, VideoStatus.GeneratingScript);

            this.scriptService.init(video);

            script = await this.scriptService.generateScript(speechFilePath);
        }

        if (canGenerateTemplate) {
            await this.notifyClient(userId, video, VideoStatus.GeneratingTemplate);

            this.templateService.prepareTemplate(script, speechFilePath, video);

            template = await this.templateService.createTemplate();

            if (!template) {
                throw new Error(
                    "An issue happened and the template was not generated. Please contact us pasting this error message"
                );
            }
        }

        try {
            if (!canRenderVideo) {
                return;
            }

            if (template) {
                await this.notifyClient(userId, video, VideoStatus.Rendering);

                const videoRenderer = new VideoRendererService(
                    template,
                    videoRenderingFolder.tempFolderPath
                );

                try {
                    await videoRenderer.initRender(async (videoPath) => {
                        const time = new Date().getTime();

                        try {
                            const videoFileName = `system/${userId}/videos/${video.name}-${time}.mp4`;
                            const thumbnailFileName = `system/${userId}/thumbnails/${video.name}-${time}.jpg`;
                            const thumbnailPath = `${thumbnailFolder.tempFolderPath}/${video.name}.jpg`;

                            await this.fileSystem.createDirectory(thumbnailFolder.tempFolderPath);

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
                                    thumbnailUrl: this.storage.getFileUrl(thumbnailFileName),
                                    duration,
                                },
                                VideoStatus.Rendered
                            );
                        } catch (error) {
                            console.log(error, "error");

                            throw new Error(
                                "The generated video was not uploaded successfully to the storage provider. Please contact us pasting this error message"
                            );
                        }
                    });
                } catch (error) {
                    console.log(error, "yoyo error 2");
                }

                await finalVoiceFolder.cleanUp();
                await thumbnailFolder.cleanUp();
                await videoRenderingFolder.cleanUp();

                return { result: "Video created" };
            }

            throw new Error(
                "An issue happened and the video was not generated. Please contact us pasting this error message"
            );
        } catch (error) {
            console.log(error, "yoyo error 1");

            throw new Error(
                "An unknow error occured. Please contact us pasting this error message"
            );
        }
    }

    private async notifyClient(userId: string, video: IVideo, status: VideoStatus) {
        const videoCollectionPath = `users/${userId}/videos`;
        const newVideo: IVideo = {
            ...video,
            status,
        };

        try {
            await this.database.update(videoCollectionPath, newVideo.id, newVideo);
        } catch {
            throw new Error(
                "An unknow error occured. Please contact us pasting this error message"
            );
        }

        this.notificationService.notifyClient(userId, {
            event: "videoUpdate",
            data: newVideo,
            cacheKey: [getVideosCacheKey(userId), getVideoByIdCacheKey(video.id)],
        });
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
