import { forwardRef, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import Bull, { Queue } from "bull";
import { Redis } from "ioredis";
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
export class VideoRenderingJobService implements OnModuleInit {
    private maxAttempts = 1;

    private queues = new Map<string, Queue<VideoRenderingJobData>>();

    private redis: Redis;

    private videoQueueName = "render-video-user";

    private queueOptions: Bull.QueueOptions = {
        redis: {
            host: "localhost",
            port: 6379,
        },
        defaultJobOptions: {
            attempts: this.maxAttempts,
            backoff: {
                type: "exponential",
                delay: 3 * 1000,
            },
            removeOnComplete: true,
            removeOnFail: true,
        },
    };

    constructor(
        @Inject(forwardRef(() => VideoProcessingService))
        private readonly videoProcessingService: VideoProcessingService,
        private readonly notificationService: NotificationsService,
        private readonly tempFoldersService: TempFoldersService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {
        this.redis = new Redis();
    }

    async onModuleInit() {
        let userQueue: Queue;

        const queuesNames = await this.findAllQueues(this.videoQueueName);

        for (const name of queuesNames) {
            const userId = name.split("-").pop();

            userQueue = new Bull(name, this.queueOptions);

            userQueue.process(async (job) => {
                await this.processVideoRenderingJob(job);
            });

            this.queues.set(userId, userQueue);
        }
    }

    async renderVideo(data: VideoRenderingJobData) {
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

        if (!userQueue) {
            const queueName = `${this.videoQueueName}-${data.userId}`;

            userQueue = new Bull(queueName, this.queueOptions);

            userQueue.process(async (job, done) => {
                await this.processVideoRenderingJob(job);
                done();
            });

            this.queues.set(data.userId, userQueue);
        }

        await userQueue.add(data);

        userQueue.on("failed", async (job) => {
            console.log("failed");
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
        });
    }

    getQueueByUserId(userId: string): Queue<VideoRenderingJobData> | undefined {
        return this.queues.get(userId);
    }

    // TODO - make sure it can delete a running job
    // async removeJobFromQueue(userId: string, videoId: string) {
    //     const queue = this.queues.get(userId);
    //     if (!queue) {
    //         console.error(`Queue not found for user: ${userId}`);
    //         return;
    //     }

    //     const jobs = await queue.getJobs(["waiting", "active", "delayed", "completed", "failed"]);
    //     await queue.pause(true, true);
    //     for (const job of jobs) {
    //         if (job.data.video?.id === videoId) {
    //             console.log(`Removing job ${job.id}`);
    //             try {
    //                 // queue.removeJobs(job.id)
    //                 // await job.releaseLock();
    //                 // // Consider additional checks here for job state if necessary
    //                 // // await job.moveToCompleted("Video deleted", true);
    //                 // await job.moveToFailed({ message: "cancel job" }, true);
    //                 // await job.discard();
    //                 // await job.remove();
    //                 console.log(`Successfully removed job ${job?.id}`);
    //             } catch (error) {
    //                 console.error(`Error removing job ${job.id}: ${error}`);
    //             }
    //         }
    //     }
    //     await queue.resume(true);
    // }

    async findAllQueues(prefix: string) {
        const keys = await this.redis.keys(`bull:${prefix}-*:*`);

        const queueNames = keys
            .map((key) => {
                const parts = key.split(":");
                return parts[1];
            })
            .filter((value, index, self) => self.indexOf(value) === index);

        return queueNames;
    }

    private async processVideoRenderingJob(job: Bull.Job<VideoRenderingJobData>) {
        const { userId, video } = job.data;

        await this.videoProcessingService.renderVideo(userId, video);
    }
}
