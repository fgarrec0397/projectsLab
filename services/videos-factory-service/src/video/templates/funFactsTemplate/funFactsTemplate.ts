import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { Template, TimedText } from "../../videoTypes";

type FunFactsTemplateData = {
    subtitles: TimedText[];
};

export const funFactsTemplate = (data: FunFactsTemplateData): Template => ({
    fps: 60,
    outputFormat: "mp4",
    width: 1080,
    height: 1920,
    elements: [
        new VideoRenderer.Video({
            name: "video1",
            sourcePath: getAssetsPath(
                "1 hour 20 minutes of relaxing Minecraft Parkour (Nostalgia, Scenery, No Ads).mp4"
            ),
        }),
        // new VideoRenderer.Composition({
        //     name: "comp 1",
        //     track: 1,
        //     elements: [
        //         new VideoRenderer.Video({
        //             name: "video1",
        //             sourcePath: getAssetsPath("video1.mp4"),
        //             start: 0,
        //             end: 10,
        //         }),
        //         new VideoRenderer.Video({
        //             name: "video2",
        //             sourcePath: getAssetsPath("video2.mp4"),
        //             start: 10,
        //             end: 25,
        //         }),
        //         new VideoRenderer.Video({
        //             name: "video3",
        //             sourcePath: getAssetsPath("video3.mp4"),
        //             start: 25,
        //             end: 35,
        //         }),
        //         new VideoRenderer.Video({
        //             name: "video4",
        //             sourcePath: getAssetsPath("video4.mp4"),
        //             start: 35,
        //             end: 56,
        //         }),
        //         new VideoRenderer.Video({
        //             name: "video5",
        //             sourcePath: getAssetsPath("video5.mp4"),
        //             start: 56,
        //             end: 73,
        //         }),
        //     ],
        // }),
        // new VideoRenderer.Audio({
        //     name: "audio1",
        //     sourcePath: getAssetsPath("background-music-Blade-Runner2049.mp3"),
        // }),
        new VideoRenderer.Audio({
            name: "audio1",
            sourcePath: getAssetsPath("speech.mp3"),
            isVideoLengthHandler: true,
        }),
        new VideoRenderer.Text({
            name: "text",
            value: data.subtitles,
        }),
    ],
});
