import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { Template, VideoFactory } from "../../modules/VideoFactory/VideoFactory";

export const funFactsTemplate: Template = {
    // duration: 40,
    fps: 60,
    outputFormat: "mp4",
    width: 1080,
    height: 1920,
    // useFrames: true,
    elements: [
        new VideoFactory.Video({
            name: "video1",
            sourcePath: getAssetsPath("video1.mp4"),
            start: 0,
            end: 6,
        }),
        new VideoFactory.Video({
            name: "video2",
            sourcePath: getAssetsPath("video2.mp4"),
            start: 5,
            end: 11,
        }),
        new VideoFactory.Video({
            name: "video3",
            sourcePath: getAssetsPath("video3.mp4"),
            start: 11,
            end: 17,
        }),
        new VideoFactory.Video({
            name: "video4",
            sourcePath: getAssetsPath("video4.mp4"),
            start: 18,
            end: 25,
        }),
    ],
};
