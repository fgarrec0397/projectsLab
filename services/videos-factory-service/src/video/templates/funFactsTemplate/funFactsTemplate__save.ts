import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { Template, VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";

export const funFactsTemplate: Template = {
    duration: 10,
    fps: 60,
    outputFormat: "mp4",
    width: 1080,
    height: 1920,
    elements: [
        new VideoRenderer.Composition({
            name: "Comp 1",
            track: 1,
            elements: [
                // new VideoRenderer.Audio({
                //     name: "voiceover",
                //     sourcePath: getAssetsPath("speech.mp3"),
                // }),
                new VideoRenderer.Video({
                    name: "video1",
                    sourcePath: getAssetsPath("video1.mp4"),
                }),
            ],
        }),
        new VideoRenderer.Composition({
            name: "Comp 2",
            track: 1,
            elements: [
                // new VideoRenderer.Audio({
                //     name: "voiceover",
                //     sourcePath: getAssetsPath("speech.mp3"),
                // }),
                new VideoRenderer.Video({
                    name: "video2",
                    sourcePath: getAssetsPath("video2.mp4"),
                }),
            ],
        }),
        new VideoRenderer.Composition({
            name: "Comp 3",
            track: 1,
            elements: [
                // new VideoRenderer.Audio({
                //     name: "voiceover",
                //     sourcePath: getAssetsPath("speech.mp3"),
                // }),
                new VideoRenderer.Video({
                    name: "video3",
                    sourcePath: getAssetsPath("video3.mp4"),
                }),
                new VideoRenderer.Video({
                    name: "video4",
                    sourcePath: getAssetsPath("video4.mp4"),
                }),
            ],
        }),
        // new VideoRenderer.Audio({
        //     name: "backgroundMusic",
        //     sourcePath: getAssetsPath("background-music-Blade-Runner2049.mp3"),
        // }),
    ],
};
