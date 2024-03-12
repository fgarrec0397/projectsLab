import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { VideoRenderingJobData } from "../processors/video-processing.processor";

@Injectable()
export class JobsService {
    constructor(@InjectQueue("render-video") private videoRenderingQueue: Queue) {}

    async startRendering(data: VideoRenderingJobData) {
        console.log("startRendering");
        this.videoRenderingQueue.add(data, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
        });
    }
}
