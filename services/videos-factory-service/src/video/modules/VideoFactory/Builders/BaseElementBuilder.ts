export type BaseElementBuilderConfig = {
    id?: string;
    name: string;
    track?: number;
    start?: number;
    end?: number;
};

export class BaseElementBuilder<T extends BaseElementBuilderConfig> {
    constructor(config: T) {
        console.log(config, "BaseElementBuilder constructor");
    }
}
