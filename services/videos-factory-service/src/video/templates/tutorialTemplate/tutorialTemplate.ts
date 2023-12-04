import { CanvasRenderingContext2D, Image } from "canvas";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { TemplateConfig, TemplateScene } from "../../modules/TemplateModule";
import { interpolateKeyframes } from "../../utils/interpolateKeyFrames";
import { Subtitle } from "../../utils/mappers/mapSubtitles";
import { TemplateDictionaryItem } from "../templates";
import { renderOutro } from "./compositions/renderOutro";
import { renderThreePictures } from "./compositions/renderThreePictures";

const duration = 9;
const frameRate = 60;

export type TutorialAssets = {
    image1: Image;
    image2: Image;
    image3: Image;
    logo: Image;
};

export const tutorialTemplate: TemplateDictionaryItem = {
    config: {
        duration,
        frameRate,
        frameCount: Math.floor(duration * frameRate),
        outputFilePath: getAssetsPath("out/video.mp4"),
        size: { width: 1280, height: 720 },
    },
    assets: [
        () => ({
            slug: "image1",
            name: "Image 1",
            type: "video",
            lengthType: "in-video",
            path: getAssetsPath("pexels-4782135.mp4"),
        }),
        () => ({
            slug: "image2",
            name: "Image 2",
            type: "video",
            lengthType: "in-video",
            path: getAssetsPath("pexels-3576378.mp4"),
        }),
        () => ({
            slug: "image3",
            name: "Image 3",
            type: "video",
            lengthType: "in-video",
            path: getAssetsPath("pexels-2829177.mp4"),
        }),
        () => ({
            slug: "logo",
            name: "Logo",
            type: "image",
            lengthType: "in-video",
            path: getAssetsPath("logo.svg"),
        }),
        (config) => ({
            slug: "finalFrames",
            name: "Final frames",
            type: "audio",
            lengthType: "final-render",
            path: getAssetsPath("tmp/output/frame-%04d.png"),
            options: [
                // Set input frame rate
                `-framerate ${config.frameRate}`,
            ],
        }),
        (config) => ({
            slug: "soundtrack",
            name: "Soundtrack",
            type: "video",
            lengthType: "final-render",
            path: getAssetsPath("catch-up-loop-119712.mp3"),
            audioFilters: [
                // Set input frame rate
                `afade=out:st=${config.duration - 2}:d=2`,
            ],
        }),
    ],
    scenes: (context: CanvasRenderingContext2D): TemplateScene<TutorialAssets>[] => {
        const mainScene = <TData = Subtitle[]>(
            mainSceneAssets: TutorialAssets,
            mainSceneConfig: TemplateConfig
        ) => {
            const slideProgress = interpolateKeyframes(
                [
                    { time: 6.59, value: 0 },
                    { time: 7.63, value: 1, easing: "cubic-in-out" },
                ],
                mainSceneConfig.time
            );

            const scene1 = (assets: TutorialAssets, config: TemplateConfig) => {
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

            const scene2 = (assets: TutorialAssets, config: TemplateConfig) => {
                context.save();
                context.translate(0.25 * config.width * (1 - slideProgress), 0);
                context.globalAlpha = slideProgress;
                context.fillStyle = "black";

                renderOutro(context, assets.logo, config.width, config.height, config.time - 6.59);

                context.restore();
            };

            return [scene1, scene2];
        };

        return [mainScene];
    },
};
