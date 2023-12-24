import ffmpeg from "fluent-ffmpeg";

import { Video } from "../Entities/Video";
import { Template } from "../VideoRenderer";
import { BaseComponent, IElementComponent } from "./BaseComponent";

export class VideoComponent extends BaseComponent<Video> implements IElementComponent {
    process(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        template: Template,
        durationPerVideo?: number
    ): void {
        const video = this.element;

        if (!video) {
            return;
        }

        const getVideoDurationCommand = () => {
            if (video.duration) {
                return ["-t", video.duration.toString()];
            }

            if (video.start !== undefined && video.end !== undefined) {
                const duration = video.end - video.start;

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
            if (video.decompressPath) {
                ffmpegCommand.input(video.decompressPath);
            }

            // Process as frame sequences
            inputOptions.push("-framerate", template.fps.toString());
            this.complexFilterBuilder.addVideo();
        } else {
            // Process as video concatenation
            ffmpegCommand.input(video.sourcePath);
            this.complexFilterBuilder.addVideoWithAudio();
        }

        ffmpegCommand.inputOptions(inputOptions);
    }
}
