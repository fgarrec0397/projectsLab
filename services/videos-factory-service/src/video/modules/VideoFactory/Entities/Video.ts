import {
    RenderableElement,
    RenderableElementConfig,
    RenderableElementTypes,
} from "./RenderableElement";

type VideoConfig = RenderableElementConfig;

export class Video extends RenderableElement {
    type: RenderableElementTypes;

    sourcePath: string;

    constructor(config: VideoConfig) {
        super(config);

        this.type = "video";
        this.sourcePath = config.sourcePath;
    }
}
