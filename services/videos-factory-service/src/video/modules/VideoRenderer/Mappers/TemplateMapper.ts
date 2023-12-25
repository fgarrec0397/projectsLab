import { BaseElement } from "../Entities/BaseElement";
import { Composition } from "../Entities/Composition";
import { RenderableElement } from "../Entities/RenderableElement";
import { Text } from "../Entities/Text";
import { ElementComponentFactory } from "../Factories/ElementComponentFactory";
import { Template, TemplateAsset, TemplateText } from "../VideoRenderer";

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

    mapTemplateToTexts() {
        const texts: TemplateText[] = [];

        console.log(`Mapping Text`);

        const recursivelyMapAssets = (elements: BaseElement[]) => {
            if (!elements.length) {
                return;
            }

            elements.forEach((x) => {
                if (!(x instanceof BaseElement)) {
                    return;
                }

                if (x instanceof Text) {
                    texts.push(x);
                }

                if (x instanceof Composition && x.elements?.length) {
                    recursivelyMapAssets(x.elements);
                }
            });
        };

        recursivelyMapAssets(this.template.elements);

        return texts;
    }

    mapDurationPerVideo() {
        const numberOfVideos = this.getAssets().length;
        return this.template.duration ? this.template.duration / numberOfVideos : undefined;
    }

    mapTemplateToElements() {
        return this.template.elements.map((element) =>
            this.elementsFactory.createElementComponent(element)
        );
    }

    private getAssets() {
        if (!this.assets?.length) {
            return this.mapTemplateToAssets();
        }

        return this.assets;
    }
}
