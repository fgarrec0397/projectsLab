import ffmpeg from "fluent-ffmpeg";

import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Audio } from "../Entities/Audio";
import { IElementComponent } from "./IElementComponent";

export class AudioComponent implements IElementComponent {
    audio: Audio;

    constructor(audio: Audio) {
        this.audio = audio;
    }

    process(ffmpegCommand: ffmpeg.FfmpegCommand, complexFilterBuilder: ComplexFilterBuilder): void {
        if (!this.audio) {
            return;
        }

        ffmpegCommand.input(this.audio.sourcePath);
        complexFilterBuilder.addAudio();
    }
}
