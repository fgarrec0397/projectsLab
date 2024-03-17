import { Injectable } from "@nestjs/common";
import Bull, { Queue } from "bull";
import { MINUTE_IN_SECONDS } from "src/common/constants";
import { TempFoldersService } from "src/common/files-system/services/temp-folders.service";
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
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {}

    async renderVideo(data: VideoRenderingJobData) {
        const maxAttempts = 3;
        let userQueue = this.queues.get(data.userId);

        await this.tempFoldersService.cleanUserTempFolders(
            this.tempFoldersService.finalVoiceGenerationFolder,
            data.userId
        );
        await this.tempFoldersService.cleanUserTempFolders(
            this.tempFoldersService.tempVoiceGenerationFolder,
            data.userId
        );
        await this.tempFoldersService.cleanUserTempFolders(
            this.tempFoldersService.thumbnailFolder,
            data.userId
        );
        await this.tempFoldersService.cleanUserTempFolders(
            this.tempFoldersService.videoRenderingFolder,
            data.userId
        );

        console.log(userQueue, "userQueue");
        // if (userQueue) {
        //     userQueue.clean(MINUTE_IN_SECONDS, "paused");
        // }

        if (!userQueue) {
            const queueName = `render-video-user-${data.userId}`;

            userQueue = new Bull(queueName, {
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 3 * 1000,
                    },
                    removeOnComplete: true,
                    removeOnFail: true,
                },
            });

            userQueue.process(async (job) => {
                await this.processVideoRenderingJob(job);
            });

            this.queues.set(data.userId, userQueue);
        }

        await userQueue.add(data);

        userQueue.on("failed", async (job) => {
            console.log(job.failedReason, "job failed");

            if (job.attemptsMade === maxAttempts) {
                const videoCollectionPath = `users/${data.userId}/videos`;

                const failedVideo: IVideo = {
                    ...data.video,
                    status: VideoStatus.Failed,
                    failedReason: job.failedReason,
                };

                await this.database.createOrUpdate(videoCollectionPath, failedVideo);

                this.notificationService.notifyClient(data.userId, {
                    event: "videoUpdate",
                    data: {
                        ...data.video,
                        status: VideoStatus.Failed,
                        failedReason: job.failedReason,
                    },
                    cacheKey: [getVideosCacheKey(data.userId), getVideoByIdCacheKey(data.video.id)],
                });
            }
        });
    }

    getQueueByUserId(userId: string): Queue<VideoRenderingJobData> | undefined {
        return this.queues.get(userId);
    }

    async removeJobFromQueue(userId: string, jobId: string | number) {
        const queue = this.getQueueByUserId(userId);
        const job = await queue.getJob(jobId);

        if (job) {
            await job.remove();
        }
    }

    private async processVideoRenderingJob(job: Bull.Job<VideoRenderingJobData>) {
        const { userId, video } = job.data;

        await this.videoProcessingService.renderVideo(userId, video);
    }
}
