import { Injectable } from "@nestjs/common";
import Bull, { Queue } from "bull";
import { IVideo } from "src/modules/videos/videos.types";

import { VideoProcessingService } from "../../modules/video-processing/services/video-processing.service";

export type VideoRenderingJobData = {
    userId: string;
    video: IVideo;
};

@Injectable()
export class JobsService {
    private queues = new Map<string, Queue<VideoRenderingJobData>>();

    constructor(private readonly videoProcessingService: VideoProcessingService) {}

    async renderVideo(data: VideoRenderingJobData) {
        let userQueue = this.queues.get(data.userId);

        if (!userQueue) {
            const queueName = `render-video-user-${data.userId}`;

            userQueue = new Bull(queueName);

            userQueue.process(async (job) => {
                await this.processVideoRenderingJob(job);
            });

            this.queues.set(data.userId, userQueue);
        }

        await userQueue.add(data, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
        });
    }

    private async processVideoRenderingJob(job: Bull.Job<VideoRenderingJobData>) {
        const { userId, video } = job.data;

        await this.videoProcessingService.renderVideo(userId, video);
    }
}
