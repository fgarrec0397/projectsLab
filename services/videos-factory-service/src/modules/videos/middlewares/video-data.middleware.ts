import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { IVideo } from "../videosTypes";

@Injectable()
export class VideoDataMiddleware implements NestMiddleware {
    use(request: Request, _: Response, next: NextFunction) {
        const videoData = request.body as IVideo;

        request.videoData = videoData;

        console.log(request.videoData, "request.videoData VideoDataMiddleware");

        next();
    }
}
