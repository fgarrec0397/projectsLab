import { Dictionary } from "@projectslab/helpers";
import { CanvasRenderingContext2D, Image } from "canvas";

export type Template<TemplateAssets extends Dictionary<Image>> = (
    context: CanvasRenderingContext2D
) => TemplateScene<TemplateAssets>[];

export type TemplateScene<
    TemplateAssets extends Dictionary<Image> = any,
    TData extends Dictionary<any> = any,
> = (
    assets: TemplateAssets,
    config: TemplateConfig,
    data: TData
) => TemplateScene<TemplateAssets>[] | TemplateScene<TemplateAssets> | void;

export type TemplateConfig = {
    width: number;
    height: number;
    time: number;
};
