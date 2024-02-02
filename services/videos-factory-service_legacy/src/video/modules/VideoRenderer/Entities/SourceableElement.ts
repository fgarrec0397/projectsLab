import { BaseElement, BaseElementConfig } from "./BaseElement";

export const sourceableElementTypes = {
    video: "video",
    image: "image",
    audio: "audio",
};

export type SourceableElementTypes = keyof typeof sourceableElementTypes;

export type SourceableElementConfig = Omit<BaseElementConfig, "type"> & {
    sourcePath: string;
    type?: SourceableElementTypes;
};

export abstract class SourceableElement extends BaseElement {
    sourcePath: string;

    constructor(config: SourceableElementConfig) {
        super(config);

        this.sourcePath = config.sourcePath;
    }
}
