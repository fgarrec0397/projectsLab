import ffmpeg from "fluent-ffmpeg";

import { Audio } from "../Entities/Audio";
import { BaseComponent, IElementComponent } from "./BaseComponent";

export class AudioComponent extends BaseComponent<Audio> implements IElementComponent {
    process(ffmpegCommand: ffmpeg.FfmpegCommand): void {
        const audio = this.element;

        if (!audio) {
            return;
        }

        ffmpegCommand.input(audio.sourcePath);
        this.complexFilterBuilder.addAudio();
    }
}
