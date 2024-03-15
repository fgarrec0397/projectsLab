import { Injectable } from "@nestjs/common";
import Bull, { Queue } from "bull";
import path from "path";
import { HOUR_IN_SECONDS } from "src/common/constants";
import { FileSystemService } from "src/common/files-system/services/file-system.service";
import { TempFoldersService } from "src/common/files-system/services/temp-folders.service";
// import { FileSystem } from "src/common/FileSystem";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";
import { NotificationsService } from "src/modules/notifications/services/notifications.service";
import { VideoProcessingService } from "src/modules/video-processing/services/video-processing.service";
import { getVideoByIdCacheKey, getVideosCacheKey } from "src/modules/videos/utils/videos.utils";
import { IVideo, VideoStatus } from "src/modules/videos/videos.types";

export type VideoRenderingJobData = {
    userId: string;
    video: IVideo;
};

@Injectable()
export class JobsService {
    private queues = new Map<string, Queue<VideoRenderingJobData>>();

    constructor(
        private readonly videoProcessingService: VideoProcessingService,
        private readonly notificationService: NotificationsService,
        private readonly tempFoldersService: TempFoldersService,
        private readonly fileSystem: FileSystemService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {}

    async renderVideo(data: VideoRenderingJobData) {
        const userQueue = this.queues.get(data.userId);
        const maxAttempts = 3;

        if (!userQueue) {
            const queueName = `render-video-user-${data.userId}`;
            const finalVoiceGenerationFolders =
                await this.tempFoldersService.getTempFolders("final-voice-generation");
            const tempVoiceGenerationFolders =
                await this.tempFoldersService.getTempFolders("temp-voice-generation");
            const thumbnailsFolders = await this.tempFoldersService.getTempFolders("thumbnails");
            const videoRenderingFolders =
                await this.tempFoldersService.getTempFolders("video-rendering");

            // const videoRenderingFoldersName = videoRenderingFolders.map((x) => x.name);

            console.log(finalVoiceGenerationFolders, "finalVoiceGenerationFolders");

            for (const folder of finalVoiceGenerationFolders) {
                const [id, timestamp] = folder.name.split("-");

                if (id === data.userId) {
                    const now = Date.now();
                    const oneHourAgo = now - HOUR_IN_SECONDS * 1000;
                    const isOlderThanOneHour = Number(timestamp) < oneHourAgo;

                    if (isOlderThanOneHour) {
                        await this.fileSystem.removeFile(path.join(folder.path, folder.name));
                    }
                }
            }

            // userQueue = new Bull(queueName, {
            //     defaultJobOptions: {
            //         attempts: 3,
            //         backoff: {
            //             type: "exponential",
            //             delay: 3 * 1000,
            //         },
            //     },
            // });

            // userQueue.process(async (job) => {
            //     await this.processVideoRenderingJob(job);
            // });

            // this.queues.set(data.userId, userQueue);
        }

        // await userQueue.add(data);

        // userQueue.on("failed", async (job) => {
        //     if (job.attemptsMade === maxAttempts) {
        //         console.log("Job wont be retried");
        //         const videoCollectionPath = `users/${data.userId}/videos`;

        //         const failedVideo: IVideo = {
        //             ...data.video,
        //             status: VideoStatus.Failed,
        //             failedReason: job.failedReason,
        //         };

        //         await this.database.createOrUpdate(videoCollectionPath, failedVideo);

        //         this.notificationService.notifyClient(data.userId, {
        //             event: "videoUpdate",
        //             data: {
        //                 ...data.video,
        //                 status: VideoStatus.Failed,
        //                 failedReason: job.failedReason,
        //             },
        //             cacheKey: [getVideosCacheKey(data.userId), getVideoByIdCacheKey(data.video.id)],
        //         });
        //     }
        // });

        // userQueue.on("error", (error) => {
        //     console.log(error, "job error");
        // });
    }

    private async processVideoRenderingJob(job: Bull.Job<VideoRenderingJobData>) {
        const { userId, video } = job.data;

        await this.videoProcessingService.renderVideo(userId, video);
    }

    // private async getTempFolders(name: string) {
    //     return FileSystem.getFolders(FileSystem.getAssetsPath(`temp/${name}`));
    // }
}
