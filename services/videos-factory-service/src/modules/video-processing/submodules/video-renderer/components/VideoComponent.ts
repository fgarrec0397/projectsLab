import ffmpeg from "fluent-ffmpeg";

import { VideoUtils } from "../../../../../common/utils/video.utils";
import { Video } from "../entities/Video";
import { Template } from "../video-renderer.types";
import { BaseComponent, IElementComponent } from "./BaseComponent";

export class VideoComponent extends BaseComponent<Video> implements IElementComponent {
    async process(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        _: Template,
        durationPerVideo?: number
    ): Promise<void> {
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
        this.complexFilterBuilder.addVideoWithAudio(undefined, { volume: 0 });

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
