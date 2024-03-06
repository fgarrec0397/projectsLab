import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { IVideo } from "../videos.types";

@Injectable()
export class VideoDataMiddleware implements NestMiddleware {
    use(request: Request, _: Response, next: NextFunction) {
        const videoData = request.body as IVideo;
        const videoId = request.params.videoId as string;

        request.videoId = videoId;
        request.videoData = videoData;

        next();
    }
}
