import { CanvasRenderingContext2D, Image } from "canvas";

import { renderOutro } from "../compositions/renderOutro";
import { renderThreePictures } from "../compositions/renderThreePictures";
import { interpolateKeyframes } from "../utils/interpolateKeyFrames";

export type Scene = (assets: SceneAssetsDictionary, config: SceneConfig) => Scene[] | Scene | void;

export type SceneAssetsDictionary = {
    image1: Image;
    image2: Image;
    image3: Image;
    logo: Image;
};

export type SceneConfig = {
    width: number;
    height: number;
    time: number;
};

export class SceneService {
    context: CanvasRenderingContext2D;

    scenes: Scene[];

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;

        this.scenes = this.initScenes(context);
    }

    renderScenes(assets: SceneAssetsDictionary, config: SceneConfig) {
        const callScenesRecursively = (scenes: Scene[]) => {
            scenes.forEach((scene) => {
                const result = scene(assets, config);

                if (Array.isArray(result)) {
                    callScenesRecursively(result);
                }
            });
        };

        callScenesRecursively(this.scenes);
    }

    private initScenes(context: CanvasRenderingContext2D) {
        const mainScene = (
            mainSceneAssets: SceneAssetsDictionary,
            mainSceneConfig: SceneConfig
        ) => {
            const slideProgress = interpolateKeyframes(
                [
                    { time: 6.59, value: 0 },
                    { time: 7.63, value: 1, easing: "cubic-in-out" },
                ],
                mainSceneConfig.time
            );

            const scene1 = (assets: SceneAssetsDictionary, config: SceneConfig) => {
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

            const scene2 = (assets: SceneAssetsDictionary, config: SceneConfig) => {
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
    }
}
