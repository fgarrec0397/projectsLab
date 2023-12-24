import ffmpeg from "fluent-ffmpeg";

import { BaseElement } from "../../Entities/BaseElement";
import { Template } from "../../VideoRenderer";

export interface IElementProcessingStrategy {
    processElement(
        element: BaseElement,
        ffmpegCommand: ffmpeg.FfmpegCommand,
        template: Template
    ): void;
}
