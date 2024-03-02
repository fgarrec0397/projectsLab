import ffmpeg from "fluent-ffmpeg";

import { BaseElement } from "../entities/BaseElement";
import { ComplexFilterBuilder } from "../builders/video-complexfilter.builder";
import { Template } from "../video-renderer.types";

export interface IElementComponent {
    process(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        template: Template,
        durationPerVideo?: number
    ): Promise<void> | void;
    handleVideoDuration(ffmpegCommand: ffmpeg.FfmpegCommand): Promise<void> | void;
}

export class BaseComponent<T extends BaseElement> {
    complexFilterBuilder: ComplexFilterBuilder;

    element: T;

    constructor(element: T, complexFilterBuilder: ComplexFilterBuilder) {
        this.complexFilterBuilder = complexFilterBuilder;
        this.element = element;
    }

    handleVideoDuration(ffmpegCommand: ffmpeg.FfmpegCommand) {
        if (!this.element.isVideoLengthHandler) {
            return;
        }

        if (this.element.duration) {
            ffmpegCommand.duration(this.element.duration);
        }
    }
}
