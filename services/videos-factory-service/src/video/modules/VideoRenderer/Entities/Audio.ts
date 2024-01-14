import {
    SourceableElement,
    SourceableElementConfig,
    SourceableElementTypes,
} from "./SourceableElement";

type AudioConfig = SourceableElementConfig;

export class Audio extends SourceableElement {
    type: SourceableElementTypes;

    sourcePath: string;

    constructor(config: AudioConfig) {
        super(config);

        this.type = "audio";
        this.sourcePath = config.sourcePath;
    }
}
