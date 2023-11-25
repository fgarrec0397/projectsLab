import { VideoConfig } from "../../controllers/v1/videoController";
import { SceneConfig } from "../../services/sceneService";

export const mapVideoConfigToSceneConfig = (config: VideoConfig, time: number): SceneConfig => {
    return { width: config.size.width, height: config.size.height, time };
};
