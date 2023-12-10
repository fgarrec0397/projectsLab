import { BaseElementBuilder, BaseElementBuilderConfig } from "./BaseElementBuilder";

type CompositionBuilderConfig = BaseElementBuilderConfig & {
    elements: BaseElementBuilder<any>[];
};

export class CompositionBuilder implements BaseElementBuilder<CompositionBuilderConfig> {
    constructor(config: CompositionBuilderConfig) {
        console.log(config, "CompositionBuilder constructor");
    }
}
