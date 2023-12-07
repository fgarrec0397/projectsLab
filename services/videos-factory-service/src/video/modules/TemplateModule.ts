import { Dictionary } from "@projectslab/helpers";
import { Canvas, CanvasRenderingContext2D, Image } from "canvas";

import { templates } from "../templates/templates";
import { TemplateDictionaryItem, TemplatesDictionary } from "../templates/templateTypes";

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

export class TemplateModule<
    TemplateAssets extends Dictionary<Image> = any,
    TData extends Dictionary<any> = Dictionary<any>,
> {
    canvas: Canvas;

    canvasContext: CanvasRenderingContext2D;

    template: TemplateDictionaryItem;

    data: TData;

    constructor(templateKey: keyof TemplatesDictionary, data: TData) {
        this.template = templates[templateKey];
        this.canvas = new Canvas(this.template.config.size.width, this.template.config.size.height);
        this.canvasContext = this.canvas.getContext("2d");
        this.data = data;
    }

    renderTemplates(assets: TemplateAssets, config: TemplateConfig) {
        const callTemplatesRecursively = (templateScenes: TemplateScene<TemplateAssets>[]) => {
            templateScenes.forEach((template) => {
                const result = template(assets, config, this.data);

                if (Array.isArray(result)) {
                    callTemplatesRecursively(result);
                }
            });
        };

        callTemplatesRecursively(this.template.scenes(this.canvasContext));
    }
}
