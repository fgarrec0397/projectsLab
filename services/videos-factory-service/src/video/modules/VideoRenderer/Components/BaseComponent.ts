import ffmpeg from "fluent-ffmpeg";

import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { BaseElement } from "../Entities/BaseElement";
import { Template } from "../VideoRenderer";

export interface IElementComponent {
    process(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        template: Template,
        durationPerVideo?: number
    ): void;
}

export class BaseComponent<T extends BaseElement> {
    complexFilterBuilder: ComplexFilterBuilder;

    element: T;

    constructor(element: T, complexFilterBuilder: ComplexFilterBuilder) {
        this.complexFilterBuilder = complexFilterBuilder;
        this.element = element;
    }
}
