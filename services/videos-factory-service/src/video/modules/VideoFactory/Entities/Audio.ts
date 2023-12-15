import {
    RenderableElement,
    RenderableElementConfig,
    RenderableElementTypes,
} from "./RenderableElement";

type AudioConfig = RenderableElementConfig;

export class Audio extends RenderableElement {
    type: RenderableElementTypes;

    sourcePath: string;

    constructor(config: AudioConfig) {
        super(config);

        this.type = "audio";
        this.sourcePath = config.sourcePath;
    }
}
