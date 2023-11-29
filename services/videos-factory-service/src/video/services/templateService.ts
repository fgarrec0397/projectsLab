import { Dictionary } from "@projectslab/helpers";
import { CanvasRenderingContext2D, Image } from "canvas";

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

export class TemplateService<TemplateAssets extends Dictionary<Image> = any> {
    templateScenes: TemplateScene<TemplateAssets>[];

    constructor(templateScenes: TemplateScene<TemplateAssets>[]) {
        this.templateScenes = templateScenes;
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

        callTemplatesRecursively(this.templateScenes);
    }
}
