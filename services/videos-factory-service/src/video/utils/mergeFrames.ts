import ffmpeg from "fluent-ffmpeg";

import { VideoAssetDictionary, VideoConfig } from "../controllers/v1/videoController";

export const mergeFrames = async (assets: VideoAssetDictionary, config: VideoConfig) => {
    const ffmpegCommand = ffmpeg();

    await new Promise<void>((resolve, reject) => {
        Object.keys(assets).forEach((x) => {
            const asset = assets[x](config);

            if (!asset.options || !asset.audioFilters) {
                ffmpegCommand.input(asset.path);
            }

            if (asset.options) {
                ffmpegCommand.inputOptions(asset.options);
            }

            if (asset.audioFilters) {
                ffmpegCommand.audioFilters(asset.audioFilters);
            }
        });

        ffmpegCommand
            .videoCodec("libx264")
            .outputOptions([
                // YUV color space with 4:2:0 chroma subsampling for maximum compatibility with
                // video players
                "-pix_fmt yuv420p",
            ])

            // Set the output duration. It is required because FFmpeg would otherwise
            // automatically set the duration to the longest input, and the soundtrack might
            // be longer than the desired video length
            .duration(config.duration)
            // Set output frame rate
            .fps(config.frameRate)

            // Resolve or reject (throw an error) the Promise once FFmpeg completes
            .saveToFile(config.outputFilePath)
            .on("end", () => resolve())
            .on("error", (error) => reject(new Error(error)));
    });
};
