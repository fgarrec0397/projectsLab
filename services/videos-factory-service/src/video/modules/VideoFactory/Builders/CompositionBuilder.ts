import { BaseElementBuilder, BaseElementBuilderConfig, ElementType } from "./BaseElementBuilder";

type CompositionBuilderConfig = BaseElementBuilderConfig & {
    elements: BaseElementBuilder[];
};

export class CompositionBuilder extends BaseElementBuilder {
    type: ElementType;

    elements: BaseElementBuilder[];

    constructor(config: CompositionBuilderConfig) {
        super(config);

        this.type = "composition";
        this.elements = config.elements;
    }
}
