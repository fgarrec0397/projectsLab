import { BaseElementBuilder, BaseElementBuilderConfig, ElementType } from "./BaseElementBuilder";

type AudioBuilderConfig = BaseElementBuilderConfig & {
    sourcePath: string;
};

export class AudioBuilder extends BaseElementBuilder {
    type: ElementType;

    sourcePath: string;

    constructor(config: AudioBuilderConfig) {
        super(config);

        this.type = "audio";
        this.sourcePath = config.sourcePath;
    }
}
