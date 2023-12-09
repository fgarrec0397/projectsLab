import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { VideoFactory } from "../../modules/VideoFactory/VideoFactory";

export const funFactsTemplate = new VideoFactory.Template({
    duration: 10,
    fps: 60,
    outputFormat: "mp4",
    width: 1080,
    height: 1920,
    elements: [
        new VideoFactory.Composition({
            track: 1,
            elements: [
                new VideoFactory.Audio({
                    name: "voiceover",
                    sourcePath: getAssetsPath("speech.mp3"),
                }),
                new VideoFactory.Video({
                    name: "video1",
                    sourcePath: getAssetsPath("video1.mp4"),
                }),
            ],
        }),
        new VideoFactory.Composition({
            track: 1,
            elements: [
                new VideoFactory.Audio({
                    name: "voiceover",
                    sourcePath: getAssetsPath("speech.mp3"),
                }),
                new VideoFactory.Video({
                    name: "video2",
                    sourcePath: getAssetsPath("video2.mp4"),
                }),
            ],
        }),
        new VideoFactory.Composition({
            track: 1,
            elements: [
                new VideoFactory.Audio({
                    name: "voiceover",
                    sourcePath: getAssetsPath("speech.mp3"),
                }),
                new VideoFactory.Video({
                    name: "video3",
                    sourcePath: getAssetsPath("video3.mp4"),
                }),
            ],
        }),
        new VideoFactory.Audio({
            name: "backgroundMusic",
            sourcePath: getAssetsPath("background-music-Blade-Runner2049.mp3"),
        }),
    ],
});

const test = funFactsTemplate;
