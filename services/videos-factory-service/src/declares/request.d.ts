import "express";

import { IVideo } from "src/modules/videos/videos.types";

declare module "express" {
    interface Request {
        userId?: string;
        videoData?: IVideo;
    }
}
