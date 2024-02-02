import { Template } from "../../../videoTypes";
import { IElementComponent } from "../Components/BaseComponent";
import { IFragmentableComponent } from "../Components/FragmentableComponent";
import { BaseElement } from "../Entities/BaseElement";
import { Composition } from "../Entities/Composition";
import { SourceableElement } from "../Entities/SourceableElement";
import { ElementComponentFactory } from "../Factories/ElementComponentFactory";
import { TemplateAsset } from "../VideoRenderer";

export class TemplateMapper {
    template: Template;

    elementsFactory: ElementComponentFactory;

    assets?: TemplateAsset[];

    constructor(template: Template, elementsFactory: ElementComponentFactory) {
        this.template = template;
        this.elementsFactory = elementsFactory;
    }

    mapTemplateToAssets() {
        const assets: SourceableElement[] = [];

        console.log(`Mapping assets`);

        const recursivelyMapAssets = (elements: BaseElement[]) => {
            if (!elements.length) {
                return;
            }

            elements.forEach((x) => {
                if (!(x instanceof BaseElement)) {
                    return;
                }

                if (x instanceof SourceableElement) {
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

    mapTemplateToFragmentableElements() {
        return this.template.elements
            .map((element) => this.elementsFactory.createFragmentComponents(element))
            .filter((x) => x !== undefined) as (IElementComponent & IFragmentableComponent)[];
    }

    private getAssets() {
        if (!this.assets?.length) {
            return this.mapTemplateToAssets();
        }

        return this.assets;
    }
}
