import ffmpeg from "fluent-ffmpeg";

import { Composition } from "../entities/Composition";
import { ComplexFilterBuilder } from "../builders/video-complexfilter.builder";
import { Template } from "../video-renderer.types";
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
