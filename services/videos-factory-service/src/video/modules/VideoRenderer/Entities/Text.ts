import { TimedText } from "../../../utils/mappers/mapSubtitles";
import { BaseElement, BaseElementConfig } from "./BaseElement";

type TextConfig = BaseElementConfig & {
    value: string | TimedText[];
};

export class Text extends BaseElement {
    value: string | TimedText[];

    constructor(config: TextConfig) {
        super(config);

        this.type = "text";
        this.value = config.value;
    }
}
