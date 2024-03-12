import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

import { IVideo } from "../../videos/videos.types";
import { VideoProcessingService } from "../services/video-processing.service";

type VideoRenderingJobData = {
    userId: string;
    video: IVideo;
};

export const VIDEO_RENDERING_PROCESS = "video-rendering";

@Processor()
export class VideoProcessingProcessor {
    constructor(private videoProcessingService: VideoProcessingService) {}

    @Process("render-video")
    async handleVideoRenderingJob(job: Job<VideoRenderingJobData>) {
        const { userId, video } = job.data;
        console.log({ userId, video, job }, "job");

        const result = await this.videoProcessingService.renderVideo(userId, video);
        console.log(`Video processed: ${JSON.stringify(result)}`);
    }
}
