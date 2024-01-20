import { FileSystem } from "../../../core/modules/FileSystem";
import { VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { Template, TimedText } from "../../videoTypes";

type FunFactsTemplateData = {
    subtitles: TimedText[];
};

export const funFactsTemplate = (data: FunFactsTemplateData): Template => {
    console.log(JSON.stringify(data.subtitles), "data.subtitles");

    return {
        fps: 60,
        outputFormat: "mp4",
        width: 1080,
        height: 1920,
        elements: [
            new VideoRenderer.Video({
                name: "video1",
                sourcePath: FileSystem.getAssetsPath(
                    "1 hour 20 minutes of relaxing Minecraft Parkour (Nostalgia, Scenery, No Ads).mp4"
                ),
            }),
            new VideoRenderer.Audio({
                name: "audio1",
                sourcePath: FileSystem.getAssetsPath("speech.mp3"),
                isVideoLengthHandler: true,
            }),
            new VideoRenderer.Text({
                name: "text",
                value: data.subtitles,
            }),
        ],
    };
};
