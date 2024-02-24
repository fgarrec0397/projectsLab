import { BaseElement, BaseElementConfig, sourceableElementTypes } from "./BaseElement";

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
