import ffmpeg from "fluent-ffmpeg";

import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Template } from "../VideoRenderer";
import { IElementComponent } from "./IElementComponent";

export class CompositionComponent implements IElementComponent {
    private elements: IElementComponent[];

    constructor(elements: IElementComponent[]) {
        this.elements = elements;
    }

    process(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        complexFilterBuilder: ComplexFilterBuilder,
        template: Template,
        durationPerVideo?: number
    ): void {
        this.elements.forEach((element) => {
            element.process(ffmpegCommand, complexFilterBuilder, template, durationPerVideo);
        });
    }
}
