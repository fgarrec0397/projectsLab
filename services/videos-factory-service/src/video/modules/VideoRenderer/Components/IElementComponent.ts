import ffmpeg from "fluent-ffmpeg";

import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Template } from "../VideoRenderer";

export interface IElementComponent {
    process(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        complexFilterBuilder: ComplexFilterBuilder,
        template: Template,
        durationPerVideo?: number
    ): void;
}
