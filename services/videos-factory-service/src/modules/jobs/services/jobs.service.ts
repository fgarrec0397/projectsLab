import { Injectable, OnModuleInit } from "@nestjs/common";
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
export class JobsService implements OnModuleInit {
    private queues = new Map<string, Queue<VideoRenderingJobData>>();

    private redis: Redis;

    constructor(
        private readonly videoProcessingService: VideoProcessingService,
        private readonly notificationService: NotificationsService,
        private readonly tempFoldersService: TempFoldersService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {
        this.redis = new Redis();
    }

    async onModuleInit() {
        console.log("JobsService init");
        let userQueue: Queue;

        const queuesNames = await this.findAllQueues("render-video-user");
        console.log(queuesNames, "queuesNames");

        for (const name of queuesNames) {
            const userId = name.split("-").pop();
            console.log(userId, "userId");

            userQueue = new Bull(name, {
                redis: {
                    host: "localhost",
                    port: 6379,
                },
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

            const jobs = await userQueue.getJobs(["waiting", "paused", "delayed", "failed"]);
            console.log(jobs);
            for (const job of jobs) {
                const state = await job.getState();
                console.log(state, "state");
            }
            userQueue.process(async (job) => {
                console.log(`Processing job ${job.id}`);
                await this.processVideoRenderingJob(job);
            });

            this.queues.set(userId, userQueue);
        }
    }

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
                redis: {
                    host: "localhost",
                    port: 6379,
                },
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

            userQueue.process(async (job, done) => {
                await this.processVideoRenderingJob(job);
                done();
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
