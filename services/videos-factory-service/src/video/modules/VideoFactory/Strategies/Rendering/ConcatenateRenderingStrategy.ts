import { BaseElement } from "../../Entities/BaseElement";
import { Template } from "../../VideoFactory";
import { IElementProcessingStrategy } from "./IRenderingStrategy";

class ConcatenateProcessingStrategy implements IElementProcessingStrategy {
    processElement(
        element: BaseElement,
        ffmpegCommand: ffmpeg.FfmpegCommand,
        template: Template
    ): void {
        // Logic for processing elements in a concatenation-based rendering
    }
}
