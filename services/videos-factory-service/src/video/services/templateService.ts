import { CanvasRenderingContext2D, Image } from "canvas";

export type Template = (context: CanvasRenderingContext2D) => TemplateScene[];

export type TemplateScene = (
    assets: TemplateAssetsDictionary,
    config: TemplateConfig
) => TemplateScene[] | TemplateScene | void;

export type TemplateAssetsDictionary = {
    image1: Image;
    image2: Image;
    image3: Image;
    logo: Image;
};

export type TemplateConfig = {
    width: number;
    height: number;
    time: number;
};

export class TemplateService {
    templateScenes: TemplateScene[];

    constructor(templateScenes: TemplateScene[]) {
        this.templateScenes = templateScenes;
    }

    renderTemplates(assets: TemplateAssetsDictionary, config: TemplateConfig) {
        const callTemplatesRecursively = (templateScenes: TemplateScene[]) => {
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
