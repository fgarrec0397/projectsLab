import { uidGenerator } from "@projectslab/helpers";

import { renderableElementTypes } from "./RenderableElement";

export const elementTypes = {
    ...renderableElementTypes,
    composition: "composition",
    text: "text",
    none: "none",
};

export type ElementType = keyof typeof elementTypes;

export type BaseElementConfig = Partial<BaseElementInterface>;

export interface BaseElementInterface {
    id: string;
    name: string;
    type?: ElementType;
    track?: number;
    start?: number;
    end?: number;
    duration?: number;
}

export abstract class BaseElement implements BaseElementInterface {
    id: string;

    name: string;

    type: ElementType;

    track: number;

    start?: number;

    end?: number;

    duration?: number;

    constructor(config: BaseElementConfig) {
        this.id = uidGenerator();
        this.name = config.name || this.id;
        this.start = config.start;
        this.end = config.end;
        this.type = config.type || "none";
        this.track = config.track || 1;
        this.duration = config.duration;
    }
}
