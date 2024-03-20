import {
    SourceableElement,
    SourceableElementConfig,
    SourceableElementTypes,
} from "./SourceableElement";

type AudioConfig = SourceableElementConfig & {
    volume?: number;
};

export class Audio extends SourceableElement {
    type: SourceableElementTypes;

    sourcePath: string;

    volume?: number;

    constructor(config: AudioConfig) {
        super(config);

        this.type = "audio";
        this.sourcePath = config.sourcePath;
        this.volume = config.volume;
    }
}
