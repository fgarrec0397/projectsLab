import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { Template, VideoFactory } from "../../modules/VideoFactory/VideoFactory";

export const funFactsTemplate: Template = {
    // duration: 46,
    fps: 60,
    outputFormat: "mp4",
    width: 1080,
    height: 1920,
    elements: [
        new VideoFactory.Composition({
            name: "comp 1",
            track: 1,
            elements: [
                new VideoFactory.Video({
                    name: "video1",
                    sourcePath: getAssetsPath("video1.mp4"),
                    start: 0,
                    end: 10,
                }),
                new VideoFactory.Video({
                    name: "video2",
                    sourcePath: getAssetsPath("video2.mp4"),
                    start: 10,
                    end: 25,
                }),
                new VideoFactory.Video({
                    name: "video3",
                    sourcePath: getAssetsPath("video3.mp4"),
                    start: 25,
                    end: 35,
                }),
                new VideoFactory.Video({
                    name: "video4",
                    sourcePath: getAssetsPath("video4.mp4"),
                    start: 35,
                    end: 45,
                }),
            ],
        }),
        new VideoFactory.Audio({
            name: "audio1",
            sourcePath: getAssetsPath("background-music-Blade-Runner2049.mp3"),
        }),
    ],
};
