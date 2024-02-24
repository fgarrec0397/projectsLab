import "express";

import { IVideo } from "src/modules/videos/videosTypes";

declare module "express" {
    interface Request {
        userId?: string;
        videoData?: IVideo;
    }
}
