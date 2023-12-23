import { BaseElement, BaseElementConfig } from "./BaseElement";

export const renderableElementTypes = {
    video: "video",
    image: "image",
    audio: "audio",
    text: "text",
};

export type RenderableElementTypes = keyof typeof renderableElementTypes;

export type RenderableElementConfig = Omit<BaseElementConfig, "type"> & {
    sourcePath: string;
    type?: RenderableElementTypes;
};

export abstract class RenderableElement extends BaseElement {
    sourcePath: string;

    constructor(config: RenderableElementConfig) {
        super(config);

        this.sourcePath = config.sourcePath;
    }
}
