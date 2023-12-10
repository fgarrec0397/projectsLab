import { BaseElementBuilder, BaseElementBuilderConfig } from "./BaseElementBuilder";

type AudioBuilderConfig = BaseElementBuilderConfig & {
    sourcePath: string;
};

export class AudioBuilder implements BaseElementBuilder<AudioBuilderConfig> {
    constructor(config: AudioBuilderConfig) {
        console.log(config, "AudioBuilder constructor");
    }
}
