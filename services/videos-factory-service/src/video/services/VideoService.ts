import { VideoRenderer } from "../modules/VideoRenderer/VideoRenderer";

export class VideoService {
    private videoRenderer: VideoRenderer;

    constructor(videoRenderer: VideoRenderer) {
        this.videoRenderer = videoRenderer;
    }

    async generateVideo(template: any) {
        this.videoRenderer.init(template);
        await this.videoRenderer.initRender();
    }
}
