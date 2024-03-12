import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

import { VideoProcessingService } from "../../modules/video-processing/services/video-processing.service";
import { IVideo } from "../../modules/videos/videos.types";

export type VideoRenderingJobData = {
    userId: string;
    video: IVideo;
};

@Processor("render-video")
export class VideoProcessingProcessor {
    constructor(private videoProcessingService: VideoProcessingService) {}

    @Process()
    async handleVideoRenderingJob(job: Job<VideoRenderingJobData>) {
        const { userId, video } = job.data;

        await this.videoProcessingService.renderVideo(userId, video);
    }
}
