import "express";

import { IVideo } from "src/modules/videos/videos.types";

declare module "express" {
    interface Request {
        // session: {
        //     user
        // },
        userId?: string;
        videoId?: string;
        videoData?: IVideo;
    }
}
