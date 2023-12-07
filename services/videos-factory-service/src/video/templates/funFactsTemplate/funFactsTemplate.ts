import { CanvasRenderingContext2D, Image } from "canvas";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { TemplateConfig, TemplateScene } from "../../modules/modulesTypes";
import { cropVideo } from "../../utils/cropVideo";
import { TemplateDictionaryItem } from "../templateTypes";

export type FunFactsTemplateData = {
    asset: "video1";
    startTime: number;
    endTime: number;
}[];

export type FunFactsAssets = {
    video1: Image;
    video2: Image;
    video3: Image;
};

const seconds = 3; // 13
const minutes = 0; // 1

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
        () => ({
            slug: "voiceover",
            name: "Voiceover",
            type: "audio",
            lengthType: "final-render",
            path: getAssetsPath("speech.mp3"),
        }),
    ],
    scenes: (
        context: CanvasRenderingContext2D
    ): TemplateScene<FunFactsAssets, FunFactsTemplateData>[] => {
        const mainScene = <TData extends FunFactsTemplateData>(
            assets: FunFactsAssets,
            config: TemplateConfig,
            data: TData
        ) => {
            const scenes: TemplateScene<FunFactsAssets>[] = [];

            data.forEach((item) => {
                scenes.push(() => {
                    context.save();

                    console.log({ time: config.time, endTime: item.endTime });

                    if (config.time < item.startTime || config.time > item.endTime) {
                        context.globalAlpha = 0;
                    }

                    cropVideo(context, assets[item.asset], 0, 0, config.width, config.height);

                    context.restore();
                });
            });

            return scenes;
        };

        return [mainScene];
    },
};
