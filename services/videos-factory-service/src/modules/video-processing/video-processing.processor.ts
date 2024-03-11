// video-processing.processor.ts
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

import { IVideo } from "../videos/videos.types";
import { VideoProcessingService } from "./services/video-processing.service";

type VideoRenderingJobData = {
    userId: string;
    video: IVideo;
};

@Processor("video-rendering")
export class VideoProcessingProcessor {
    constructor(private videoProcessingService: VideoProcessingService) {}

    @Process()
    async handleVideoRenderingJob(job: Job<VideoRenderingJobData>) {
        const { userId, video } = job.data;
        console.log(job, "job");

        const result = await this.videoProcessingService.renderVideo(userId, video);
        console.log(`Video processed: ${JSON.stringify(result)}`);
    }
}
