import { VideoConfig } from "../../controllers/v1/videoController";
import { TemplateConfig } from "../../modules/modulesTypes";

export const mapVideoConfigToSceneConfig = (config: VideoConfig, time: number): TemplateConfig => {
    return { width: config.size.width, height: config.size.height, time };
};
