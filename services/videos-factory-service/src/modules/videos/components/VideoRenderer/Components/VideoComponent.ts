import ffmpeg from "fluent-ffmpeg";

import { Template } from "../../../videosTypes";
import { Video } from "../Entities/Video";
import { VideoUtils } from "../Utilities/VideoUtils";
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

    async handleVideoDuration(ffmpegCommand: ffmpeg.FfmpegCommand) {
        if (!this.element.isVideoLengthHandler) {
            return;
        }

        if (!this.element.duration) {
            const videoDuration = await VideoUtils.getVideoDuration(this.element.sourcePath);
            ffmpegCommand.duration(videoDuration);
        }

        super.handleVideoDuration(ffmpegCommand);
    }
}
