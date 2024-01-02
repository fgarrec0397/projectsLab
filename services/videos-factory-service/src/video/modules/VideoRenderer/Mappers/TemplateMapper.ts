import { IElementComponent } from "../Components/BaseComponent";
import { BaseElement } from "../Entities/BaseElement";
import { Composition } from "../Entities/Composition";
import { RenderableElement } from "../Entities/RenderableElement";
import { ElementComponentFactory } from "../Factories/ElementComponentFactory";
import { Template, TemplateAsset } from "../VideoRenderer";

export class TemplateMapper {
    template: Template;

    elementsFactory: ElementComponentFactory;

    assets?: TemplateAsset[];

    constructor(template: Template, elementsFactory: ElementComponentFactory) {
        this.template = template;
        this.elementsFactory = elementsFactory;
    }

    mapTemplateToAssets() {
        const assets: RenderableElement[] = [];

        console.log(`Mapping assets`);

        const recursivelyMapAssets = (elements: BaseElement[]) => {
            if (!elements.length) {
                return;
            }

            elements.forEach((x) => {
                if (!(x instanceof BaseElement)) {
                    return;
                }

                if (x instanceof RenderableElement) {
                    assets.push(x);
                }

                if (x instanceof Composition && x.elements?.length) {
                    recursivelyMapAssets(x.elements);
                }
            });
        };

        recursivelyMapAssets(this.template.elements);

        return assets;
    }

    mapDurationPerVideo() {
        const numberOfVideos = this.getAssets().length;
        return this.template.duration ? this.template.duration / numberOfVideos : undefined;
    }

    mapTemplateToElements() {
        return this.template.elements
            .map((element) => this.elementsFactory.createElementComponent(element))
            .filter((x) => x !== undefined) as IElementComponent[];
    }

    mapTemplateToTexts() {
        return this.template.elements
            .map((element) => this.elementsFactory.createTextComponents(element))
            .filter((x) => x !== undefined) as IElementComponent[];
    }

    private getAssets() {
        if (!this.assets?.length) {
            return this.mapTemplateToAssets();
        }

        return this.assets;
    }
}
