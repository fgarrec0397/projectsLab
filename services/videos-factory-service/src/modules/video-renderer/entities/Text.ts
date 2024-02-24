import { TextStylesProperties } from "src/modules/canvas-renderer/canvas-renderer.service";

import { TimedText } from "../video-renderer.types";
import { BaseElement, BaseElementConfig } from "./BaseElement";

type TextConfig = BaseElementConfig & {
    value: string | TimedText[] | undefined;
    styles?: TextStylesProperties;
};

export class Text extends BaseElement {
    value: string | TimedText[] | undefined;

    styles: TextStylesProperties | undefined;

    constructor(config: TextConfig) {
        super(config);

        this.type = "text";
        this.value = config.value;
        this.styles = config.styles;
    }
}
