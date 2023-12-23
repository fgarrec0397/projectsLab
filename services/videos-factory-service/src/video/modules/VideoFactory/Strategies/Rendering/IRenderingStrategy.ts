import ffmpeg from "fluent-ffmpeg";

import { BaseElement } from "../../Entities/BaseElement";
import { Template } from "../../VideoFactory";

export interface IElementProcessingStrategy {
    processElement(
        element: BaseElement,
        ffmpegCommand: ffmpeg.FfmpegCommand,
        template: Template
    ): void;
}
