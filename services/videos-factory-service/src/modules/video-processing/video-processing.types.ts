import { VideoStatus } from "../videos/videos.types";

export type VideoProcessingStepData = {
    status: VideoStatus;
    data?: any;
};
