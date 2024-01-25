import { uidGenerator } from "@projectslab/helpers";

import { FileSystem } from "../../../core/modules/FileSystem";
import { BaseTemplateData } from "../../modules/TemplateGenerator/TemplateGenerator";
import { Video } from "../../modules/VideoRenderer/Entities/Video";
import { VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { Template } from "../../videoTypes";

type FunFactsTemplateData = BaseTemplateData;

export const funFactsTemplate = (data: FunFactsTemplateData): Template => {
    return {
        fps: 60,
        outputFormat: "mp4",
        width: 1080,
        height: 1920,
        elements: [
            {
                id: uidGenerator(),
                name: "test",
                type: "video",
                track: 1,
                sourcePath: FileSystem.getAssetsPath(
                    "1 hour 20 minutes of relaxing Minecraft Parkour (Nostalgia, Scenery, No Ads).mp4"
                ),
            } as Video,
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
                value: data.script?.subtitles,
            }),
        ],
    };
};
