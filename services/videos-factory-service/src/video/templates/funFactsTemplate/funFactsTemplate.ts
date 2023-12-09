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
            path: getAssetsPath("video1.mp4"),
        }),
        () => ({
            slug: "video2",
            name: "Video 2",
            type: "video",
            lengthType: "in-video",
            path: getAssetsPath("video2.mp4"),
        }),
        // () => ({
        //     slug: "video3",
        //     name: "Video 3",
        //     type: "video",
        //     lengthType: "in-video",
        //     path: getAssetsPath("video3.mp4"),
        // }),
        // () => ({
        //     slug: "video4",
        //     name: "Video 4",
        //     type: "video",
        //     lengthType: "in-video",
        //     path: getAssetsPath("video4.mp4"),
        // }),
        // () => ({
        //     slug: "video5",
        //     name: "Video 5",
        //     type: "video",
        //     lengthType: "in-video",
        //     path: getAssetsPath("video5.mp4"),
        // }),
        // () => ({
        //     slug: "video6",
        //     name: "Video 6",
        //     type: "video",
        //     lengthType: "in-video",
        //     path: getAssetsPath("video6.mp4"),
        // }),
        // () => ({
        //     slug: "video7",
        //     name: "Video 7",
        //     type: "video",
        //     lengthType: "in-video",
        //     path: getAssetsPath("video7.mp4"),
        // }),
        // () => ({
        //     slug: "video8",
        //     name: "Video 8",
        //     type: "video",
        //     lengthType: "in-video",
        //     path: getAssetsPath("video8.mp4"),
        // }),
        // () => ({
        //     slug: "video9",
        //     name: "Video 9",
        //     type: "video",
        //     lengthType: "in-video",
        //     path: getAssetsPath("video9.mp4"),
        // }),
        // () => ({
        //     slug: "video10",
        //     name: "Video 10",
        //     type: "video",
        //     lengthType: "in-video",
        //     path: getAssetsPath("video10.mp4"),
        // }),
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
        () => ({
            slug: "backgroundMusic",
            name: "Background Music",
            type: "audio",
            lengthType: "final-render",
            path: getAssetsPath("background-music-Blade-Runner2049.mp3"),
        }),
    ],
    scenes: (
        context: CanvasRenderingContext2D
    ): TemplateScene<FunFactsAssets, FunFactsTemplateData>[] => {
        console.time("scenes");
        const mainScene = <TData extends FunFactsTemplateData>(
            assets: FunFactsAssets,
            config: TemplateConfig,
            data: TData
        ) => {
            // const scenes: TemplateScene<FunFactsAssets>[] = [];

            data.forEach((item) => {
                context.save();

                if (config.time < item.startTime || config.time > item.endTime) {
                    context.globalAlpha = 0;
                }

                cropVideo(context, assets[item.asset], 0, 0, config.width, config.height);

                context.restore();
                // scenes.push(() => {
                // });
            });

            // return scenes;
        };

        console.timeEnd("scenes");

        return [mainScene];
    },
};
