import {
    SourceableElement,
    SourceableElementConfig,
    SourceableElementTypes,
} from "./SourceableElement";

type VideoConfig = SourceableElementConfig;

export class Video extends SourceableElement {
    type: SourceableElementTypes;

    sourcePath: string;

    constructor(config: VideoConfig) {
        super(config);

        this.type = "video";
        this.sourcePath = config.sourcePath;
    }
}
