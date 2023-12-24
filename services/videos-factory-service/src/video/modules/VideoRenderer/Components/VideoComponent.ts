import ffmpeg from "fluent-ffmpeg";

import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Video } from "../Entities/Video";
import { Template } from "../VideoRenderer";
import { IElementComponent } from "./IElementComponent";

export class VideoComponent implements IElementComponent {
    video: Video;

    constructor(video: Video) {
        this.video = video;
    }

    process(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        complexFilterBuilder: ComplexFilterBuilder,
        template: Template,
        durationPerVideo?: number
    ): void {
        if (!this.video) {
            return;
        }

        const getVideoDurationCommand = () => {
            if (this.video.duration) {
                return ["-t", this.video.duration.toString()];
            }

            if (this.video.start !== undefined && this.video.end !== undefined) {
                const duration = this.video.end - this.video.start;

                return ["-t", duration.toString()];
            }

            if (!durationPerVideo) {
                return [];
            }

            return ["-t", durationPerVideo.toString()];
        };

        // Init input options
        const inputOptions = [...getVideoDurationCommand()];

        if (template.useFrames) {
            if (this.video.decompressPath) {
                ffmpegCommand.input(this.video.decompressPath);
            }

            // Process as frame sequences
            inputOptions.push("-framerate", template.fps.toString());
            complexFilterBuilder.addVideo();
        } else {
            // Process as video concatenation
            ffmpegCommand.input(this.video.sourcePath);
            complexFilterBuilder.addVideoWithAudio();
        }

        ffmpegCommand.inputOptions(inputOptions);
    }
}
