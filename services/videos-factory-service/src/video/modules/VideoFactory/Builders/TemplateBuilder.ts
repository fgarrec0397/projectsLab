import { BaseElementBuilder } from "./BaseElementBuilder";

type TemplateBuilderConfig = {
    duration: number;
    fps: number;
    outputFormat: string;
    width: number;
    height: number;
    elements: BaseElementBuilder<any>[]; // TODO - Build the other elements type before handling this
};

export class TemplateBuilder {
    config: TemplateBuilderConfig;

    constructor(config: TemplateBuilderConfig) {
        console.log(config, "TemplateBuilder constructor");
        this.config = config;
    }
}
