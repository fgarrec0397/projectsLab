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
        const hasError = false;

        let script: Script = {};
        let template: Template | undefined = undefined;

        // TODO - remove this when temp folders not removing issue is done
        if (hasError) {
            throw new Error(
                "An issue happened and the template was not generated. Please contact us pasting this error message"
            );
        }

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

                await videoRenderer.initRender(async (videoPath) => {
                    try {
                        const videoFileName = `system/${userId}/videos/${video.name}.mp4`;
                        const thumbnailFileName = `system/${userId}/thumbnails/${video.name}.jpg`;
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
                                duration,
                            },
                            VideoStatus.Rendered
                        );
                    } catch {
                        throw new Error(
                            "The generated video was not uploaded successfully to the storage provider. Please contact us pasting this error message"
                        );
                    }
                });

                await finalVoiceFolder.cleanUp();
                await thumbnailFolder.cleanUp();
                await videoRenderingFolder.cleanUp();

                return { result: "Video created" };
            }

            throw new Error(
                "An issue happened and the video was not generated. Please contact us pasting this error message"
            );
        } catch {
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

        await this.database.createOrUpdate(videoCollectionPath, newVideo);

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
