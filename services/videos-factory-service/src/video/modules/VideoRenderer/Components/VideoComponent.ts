import ffmpeg from "fluent-ffmpeg";

import { Template } from "../../../videoTypes";
import { Video } from "../Entities/Video";
import { BaseComponent, IElementComponent } from "./BaseComponent";

export class VideoComponent extends BaseComponent<Video> implements IElementComponent {
    process(ffmpegCommand: ffmpeg.FfmpegCommand, _: Template, durationPerVideo?: number): void {
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

        // Process as video concatenation
        ffmpegCommand.input(video.sourcePath);
        this.complexFilterBuilder.addVideoWithAudio();

        ffmpegCommand.inputOptions(inputOptions);
    }
}
