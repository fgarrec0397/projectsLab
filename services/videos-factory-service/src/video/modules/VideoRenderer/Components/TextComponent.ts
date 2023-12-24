import ffmpeg from "fluent-ffmpeg";

import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Text } from "../Entities/Text";
import { IElementComponent } from "./IElementComponent";

export class TextComponent implements IElementComponent {
    text: Text;

    constructor(text: Text) {
        this.text = text;
    }

    process(ffmpegCommand: ffmpeg.FfmpegCommand, complexFilterBuilder: ComplexFilterBuilder): void {
        if (!this.text) {
            return;
        }

        console.log(this.text, "this.text");
    }
}
