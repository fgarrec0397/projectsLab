import { BaseElement } from "./modules/VideoRenderer/Entities/BaseElement";

export type TimedText = {
    word: string | null | undefined;
    start: number | undefined;
    end: number | undefined;
};

export type Template = {
    duration?: number;
    fps: number;
    outputFormat: string;
    width: number;
    height: number;
    elements: BaseElement[];
};
