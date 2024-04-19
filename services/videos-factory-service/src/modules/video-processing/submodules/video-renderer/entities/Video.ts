import {
    SourceableElement,
    SourceableElementConfig,
    SourceableElementTypes,
} from "./SourceableElement";

type VideoConfig = SourceableElementConfig & {
    volume?: number;
};

export class Video extends SourceableElement {
    type: SourceableElementTypes;

    sourcePath: string;

    volume?: number;

    constructor(config: VideoConfig) {
        super(config);

        this.type = "video";
        this.sourcePath = config.sourcePath;
        this.volume = config.volume;
    }
}
