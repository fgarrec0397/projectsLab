import { CanvasRenderingContext2D } from "canvas";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import {
    TemplateAssetsDictionary,
    TemplateConfig,
    TemplateScene,
} from "../../services/templateService";
import { TemplateDictionaryItem } from "../templates";
import { renderOutro } from "./compositions/renderOutro";
import { renderThreePictures } from "./compositions/renderThreePictures";

const seconds = 13;
const minutes = 1;

const duration = minutes * 60 + seconds;
const frameRate = 60;

export const funFactsTemplate: TemplateDictionaryItem = {
    config: {
        duration,
        frameRate,
        frameCount: Math.floor(duration * frameRate),
        outputFilePath: getAssetsPath("out/video.mp4"),
        size: { width: 1080, height: 1920 },
    },
    assets: [
        () => ({
            slug: "video1",
            name: "Video 1",
            type: "video",
            lengthType: "in-video",
            path: getAssetsPath("pexels-4782135.mp4"),
        }),
        () => ({
            slug: "video2",
            name: "Video 2",
            type: "video",
            lengthType: "in-video",
            path: getAssetsPath("pexels-3576378.mp4"),
        }),
        () => ({
            slug: "video3",
            name: "Video 3",
            type: "video",
            lengthType: "in-video",
            path: getAssetsPath("pexels-2829177.mp4"),
        }),
        (config) => ({
            slug: "finalFrames",
            name: "Final frames",
            type: "video",
            lengthType: "final-render",
            path: getAssetsPath("tmp/output/frame-%04d.png"),
            options: [
                // Set input frame rate
                `-framerate ${config.frameRate}`,
            ],
        }),
        (config) => ({
            slug: "voiceover",
            name: "Voiceover",
            type: "audio",
            lengthType: "final-render",
            path: getAssetsPath("catch-up-loop-119712.mp3"),
            audioFilters: [
                // Set input frame rate
                `afade=out:st=${config.duration - 2}:d=2`,
            ],
        }),
    ],
    scenes: (context: CanvasRenderingContext2D): TemplateScene[] => {
        const scene1 = (assets: TemplateAssetsDictionary, config: TemplateConfig) => {
            context.save();
            context.translate(0.25 * config.width * -slideProgress, 0);
            context.globalAlpha = 1 - slideProgress;

            // Render the polaroid picture scene using relative sizes
            renderThreePictures(
                context,
                assets.image1,
                assets.image2,
                assets.image3,
                0.9636 * config.width,
                0.8843 * config.height,
                config.time
            );

            context.restore();
        };

        const scene2 = (assets: TemplateAssetsDictionary, config: TemplateConfig) => {
            context.save();
            context.translate(0.25 * config.width * (1 - slideProgress), 0);
            context.globalAlpha = slideProgress;
            context.fillStyle = "black";

            renderOutro(context, assets.logo, config.width, config.height, config.time - 6.59);

            context.restore();
        };

        return [scene1, scene2];
    },
};
