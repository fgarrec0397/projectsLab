import ffmpeg from "fluent-ffmpeg";

import { Template } from "../../../videosTypes";
import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Composition } from "../Entities/Composition";
import { BaseComponent, IElementComponent } from "./BaseComponent";

export class CompositionComponent extends BaseComponent<Composition> implements IElementComponent {
    childrenComponents: (IElementComponent | undefined)[];

    constructor(
        element: Composition,
        childrenComponents: (IElementComponent | undefined)[],
        complexFilterBuilder: ComplexFilterBuilder
    ) {
        super(element, complexFilterBuilder);

        this.childrenComponents = childrenComponents;
    }

    process(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        template: Template,
        durationPerVideo?: number
    ): void {
        this.childrenComponents.forEach((component) => {
            component?.process(ffmpegCommand, template, durationPerVideo);
        });
    }
}
