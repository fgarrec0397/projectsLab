import { Request, Response } from "express";

import { VideoService } from "../../services/videoService";

class VideoController {
    async get(request: Request, result: Response) {
        const duration = 9;
        const frameRate = 60;

        const video = new VideoService({ duration, frameRate, size: { width: 1280, height: 720 } });

        await video.renderVideo();

        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();
