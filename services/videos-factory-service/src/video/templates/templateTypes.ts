import { Dictionary } from "@projectslab/helpers";
import { CanvasRenderingContext2D } from "canvas";

import { VideoAssetCallback, VideoConfig } from "../controllers/v1/videoController";
import { TemplateScene } from "../modules/modulesTypes";

export type TemplatesDictionary = Dictionary<TemplateDictionaryItem>;
export type TemplateDictionaryItem = {
    config: VideoConfig;
    assets: VideoAssetCallback[];
    scenes: (context: CanvasRenderingContext2D) => TemplateScene[];
};
