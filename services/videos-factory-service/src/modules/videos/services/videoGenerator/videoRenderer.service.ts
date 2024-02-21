import { Injectable } from "@nestjs/common";

import { VideoRenderer } from "../../components/VideoRenderer/VideoRenderer";

@Injectable()
export class VideoRendererService {
    private videoRenderer: VideoRenderer;

    constructor(videoRenderer: VideoRenderer) {
        this.videoRenderer = videoRenderer;
    }

    async generateVideo(template: any) {
        this.videoRenderer.init(template);
        await this.videoRenderer.initRender();
    }
}
