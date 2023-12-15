import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { Template, VideoFactory } from "../../modules/VideoFactory/VideoFactory";

export const funFactsTemplate: Template = {
    duration: 10,
    fps: 60,
    outputFormat: "mp4",
    width: 1080,
    height: 1920,
    elements: [
        new VideoFactory.Composition({
            name: "Comp 1",
            track: 1,
            elements: [
                // new VideoFactory.Audio({
                //     name: "voiceover",
                //     sourcePath: getAssetsPath("speech.mp3"),
                // }),
                new VideoFactory.Video({
                    name: "video1",
                    sourcePath: getAssetsPath("video1.mp4"),
                }),
            ],
        }),
        new VideoFactory.Composition({
            name: "Comp 2",
            track: 1,
            elements: [
                // new VideoFactory.Audio({
                //     name: "voiceover",
                //     sourcePath: getAssetsPath("speech.mp3"),
                // }),
                new VideoFactory.Video({
                    name: "video2",
                    sourcePath: getAssetsPath("video2.mp4"),
                }),
            ],
        }),
        new VideoFactory.Composition({
            name: "Comp 3",
            track: 1,
            elements: [
                // new VideoFactory.Audio({
                //     name: "voiceover",
                //     sourcePath: getAssetsPath("speech.mp3"),
                // }),
                new VideoFactory.Video({
                    name: "video3",
                    sourcePath: getAssetsPath("video3.mp4"),
                }),
                new VideoFactory.Video({
                    name: "video4",
                    sourcePath: getAssetsPath("video4.mp4"),
                }),
            ],
        }),
        // new VideoFactory.Audio({
        //     name: "backgroundMusic",
        //     sourcePath: getAssetsPath("background-music-Blade-Runner2049.mp3"),
        // }),
    ],
};
