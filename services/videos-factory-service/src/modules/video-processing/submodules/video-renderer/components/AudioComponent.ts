import ffmpeg from "fluent-ffmpeg";

import { Audio } from "../entities/Audio";
import { VideoUtils } from "../../../../../common/utils/video.utils";
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

    async handleVideoDuration(ffmpegCommand: ffmpeg.FfmpegCommand) {
        if (!this.element.isVideoLengthHandler) {
            return;
        }

        if (!this.element.duration) {
            const audioDuration = await VideoUtils.getVideoDuration(this.element.sourcePath);
            ffmpegCommand.duration(audioDuration);
        }

        super.handleVideoDuration(ffmpegCommand);
    }
}
