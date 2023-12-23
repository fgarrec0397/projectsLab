import {
    RenderableElement,
    RenderableElementConfig,
    RenderableElementTypes,
} from "./RenderableElement";

type TextConfig = RenderableElementConfig;

export class Text extends RenderableElement {
    type: RenderableElementTypes;

    sourcePath: string;

    constructor(config: TextConfig) {
        super(config);

        this.type = "text";
        this.sourcePath = config.sourcePath;
    }
}
