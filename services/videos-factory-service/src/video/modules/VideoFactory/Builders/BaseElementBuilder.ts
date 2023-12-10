import { uidGenerator } from "@projectslab/helpers";

export const elementAssetTypes = {
    video: "video",
    image: "image",
    audio: "audio",
};

export const elementTypes = {
    ...elementAssetTypes,
    composition: "composition",
    none: "none",
};

export type ElementAssetType = keyof typeof elementAssetTypes;

export type ElementType = keyof typeof elementTypes;

export type BaseElementBuilderConfig = Partial<BaseElementBuilderInterface>;

export interface BaseElementBuilderInterface {
    id: string;
    name?: string;
    type?: ElementType;
    track?: number;
    start?: number;
    end?: number;
}

export abstract class BaseElementBuilder implements BaseElementBuilderInterface {
    id: string;

    name?: string;

    type: ElementType;

    start?: number;

    end?: number;

    track: number;

    constructor(config: BaseElementBuilderConfig) {
        this.id = uidGenerator();
        this.name = config.name;
        this.start = config.start;
        this.end = config.end;
        this.type = config.type || "none";
        this.track = config.track || 1;
    }
}
