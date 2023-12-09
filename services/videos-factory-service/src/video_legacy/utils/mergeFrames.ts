import ffmpeg from "fluent-ffmpeg";

import { getAssetsPath } from "../../core/utils/getAssetsPath";
import { VideoAssetDictionary, VideoConfig } from "../controllers/v1/videoController";
import { buildSubtitlesFilter } from "./builders/buildSubtitlesFilter";
import { Subtitle } from "./mappers/mapSubtitles";

export const mergeSubtitlesToVideo = async (subtitles: Subtitle[], config: VideoConfig) => {
    const ffmpegCommand = ffmpeg();
    const subtitlesFilters = buildSubtitlesFilter(subtitles);

    ffmpegCommand.input(config.outputFilePath);

    subtitles.forEach((_, index) => {
        const subtitlePath = getAssetsPath(`tmp/output/text-${index}.png`);
        ffmpegCommand.input(subtitlePath);
    });

    ffmpegCommand
        .complexFilter(subtitlesFilters)
        .videoCodec("libx264")
        .outputOptions(["-pix_fmt yuv420p"])
        .duration(config.duration)
        .fps(config.frameRate)
        .saveToFile(getAssetsPath("out/video2.mp4"))
        .on("end", () => console.log("Video processing completed successfully"))
        .on("error", (err: Error) => console.error("Error:", err.message));

    console.log(
        "Constructed FFmpeg command:",
        ffmpegCommand._getArguments().join(" "),
        "ffmpegCommand"
    );

    // Execute the command
    return new Promise<void>((resolve, reject) => {
        ffmpegCommand
            .on("end", () => resolve())
            .on("error", (error) => reject(new Error(error.message)))
            .run();
    });
};

export const mergeFrames = async (
    assets: VideoAssetDictionary,
    config: VideoConfig,
    subtitles?: Subtitle[]
) => {
    const ffmpegCommand = ffmpeg();

    Object.keys(assets).forEach((x) => {
        const asset = assets[x](config);

        ffmpegCommand.input(asset.path);

        if (asset.options) {
            ffmpegCommand.inputOptions(asset.options);
        }

        if (asset.audioFilters) {
            ffmpegCommand.audioFilters(asset.audioFilters);
        }
    });

    // Start building the command chain
    ffmpegCommand
        .videoCodec("libx264")
        .outputOptions(["-pix_fmt yuv420p"])
        .duration(config.duration)
        .fps(config.frameRate)
        .saveToFile(config.outputFilePath)
        .on("end", () => console.log("Video processing completed successfully"))
        .on("error", (err: Error) => console.error("Error:", err.message));

    // Execute the command
    await new Promise<void>((resolve, reject) => {
        ffmpegCommand
            .on("end", () => resolve())
            .on("error", (error) => reject(new Error(error.message)))
            .run();
    });

    if (subtitles?.length) {
        await mergeSubtitlesToVideo(subtitles, config);
    }
};
