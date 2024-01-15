import { TimedText } from "../../../videoTypes";
import { TextStylesProperties } from "../../CanvasRenderer/CanvasRenderer";
import { BaseElement, BaseElementConfig } from "./BaseElement";

type TextConfig = BaseElementConfig & {
    value: string | TimedText[];
    styles?: TextStylesProperties;
};

export class Text extends BaseElement {
    value: string | TimedText[];

    styles: TextStylesProperties | undefined;

    constructor(config: TextConfig) {
        super(config);

        this.type = "text";
        this.value = config.value;
        this.styles = config.styles;
    }
}
