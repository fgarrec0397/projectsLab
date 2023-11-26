import { CanvasRenderingContext2D } from "canvas";

import {
    TemplateAssetsDictionary,
    TemplateConfig,
    TemplateScene,
} from "../../services/templateService";
import { interpolateKeyframes } from "../../utils/interpolateKeyFrames";
import { renderOutro } from "./compositions/renderOutro";
import { renderThreePictures } from "./compositions/renderThreePictures";

export const tutorialTemplate = (context: CanvasRenderingContext2D): TemplateScene[] => {
    const mainScene = (
        mainSceneAssets: TemplateAssetsDictionary,
        mainSceneConfig: TemplateConfig
    ) => {
        const slideProgress = interpolateKeyframes(
            [
                { time: 6.59, value: 0 },
                { time: 7.63, value: 1, easing: "cubic-in-out" },
            ],
            mainSceneConfig.time
        );

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
    };

    return [mainScene];
};
