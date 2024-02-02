import { BaseElement, BaseElementConfig, ElementType } from "./BaseElement";

type CompositionConfig = BaseElementConfig & {
    elements: BaseElement[];
};

export class Composition extends BaseElement {
    type: ElementType;

    elements: BaseElement[];

    constructor(config: CompositionConfig) {
        super(config);

        this.type = "composition";
        this.elements = config.elements;
    }
}
