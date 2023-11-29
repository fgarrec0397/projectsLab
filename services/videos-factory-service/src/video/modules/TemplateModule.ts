import { Dictionary } from "@projectslab/helpers";
import { Canvas, CanvasRenderingContext2D, Image } from "canvas";

import { TemplateDictionaryItem, templates, TemplatesDictionary } from "../templates/templates";

export type Template<TemplateAssets extends Dictionary<Image>> = (
    context: CanvasRenderingContext2D
) => TemplateScene<TemplateAssets>[];

export type TemplateScene<TemplateAssets extends Dictionary<Image> = any> = (
    assets: TemplateAssets,
    config: TemplateConfig
) => TemplateScene<TemplateAssets>[] | TemplateScene<TemplateAssets> | void;

export type TemplateConfig = {
    width: number;
    height: number;
    time: number;
};

export class TemplateModule<TemplateAssets extends Dictionary<Image> = any> {
    canvas: Canvas;

    canvasContext: CanvasRenderingContext2D;

    template: TemplateDictionaryItem;

    constructor(templateKey: keyof TemplatesDictionary) {
        this.template = templates[templateKey];
        this.canvas = new Canvas(this.template.config.size.width, this.template.config.size.height);
        this.canvasContext = this.canvas.getContext("2d");
    }

    renderTemplates(assets: TemplateAssets, config: TemplateConfig) {
        const callTemplatesRecursively = (templateScenes: TemplateScene<TemplateAssets>[]) => {
            templateScenes.forEach((template) => {
                const result = template(assets, config);

                if (Array.isArray(result)) {
                    callTemplatesRecursively(result);
                }
            });
        };

        callTemplatesRecursively(this.template.scenes(this.canvasContext));
    }
}
