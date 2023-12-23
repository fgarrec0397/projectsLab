import { BaseElement, BaseElementConfig } from "./BaseElement";

type TextConfig = BaseElementConfig & {
    value: string;
};

export class Text extends BaseElement {
    value: string;

    constructor(config: TextConfig) {
        super(config);

        this.type = "text";
        this.value = config.value;
    }
}
