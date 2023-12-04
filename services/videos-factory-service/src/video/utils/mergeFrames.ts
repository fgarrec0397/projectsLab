import ffmpeg from "fluent-ffmpeg";

import { getAssetsPath } from "../../core/utils/getAssetsPath";
import { VideoAssetDictionary, VideoConfig } from "../controllers/v1/videoController";
import { buildSubtitlesFilter } from "./builders/buildSubtitlesFilter";
import { Subtitle } from "./mappers/mapSubtitles";

export const mergeFrames = async (
    assets: VideoAssetDictionary,
    config: VideoConfig,
    subtitles?: Subtitle[]
) => {
    const ffmpegCommand = ffmpeg();
    const subtitlesFilters = buildSubtitlesFilter(subtitles);

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

    const subtitlePath = getAssetsPath(`tmp/subtitles/text-%04d.png`);
    // subtitles?.forEach((_, index) => {
    //     const subtitlePath = getAssetsPath(`tmp/subtitles/text-%04d.png`);
    //     console.log(`Adding input file: ${subtitlePath}`);
    //     ffmpegCommand.input(subtitlePath);
    // });
    ffmpegCommand.input(subtitlePath);

    // console.log(JSON.stringify(subtitlesFilters), "subtitlesFilters");

    // Start building the command chain
    ffmpegCommand
        .complexFilter(subtitlesFilters)
        .videoCodec("libx264")
        .outputOptions(["-pix_fmt yuv420p"])
        .duration(config.duration)
        .fps(config.frameRate)
        .saveToFile(config.outputFilePath)
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

// import ffmpeg from "fluent-ffmpeg";

// import { getAssetsPath } from "../../core/utils/getAssetsPath";
// import { VideoAssetDictionary, VideoConfig } from "../controllers/v1/videoController";
// import { buildSubtitlesFilter } from "./builders/buildSubtitlesFilter";
// import { Subtitle } from "./mappers/mapSubtitles";

// export const mergeFrames = async (
//     assets: VideoAssetDictionary,
//     config: VideoConfig,
//     subtitles?: Subtitle[]
// ) => {
//     const ffmpegCommand = ffmpeg();
//     const subtitlesFilters = buildSubtitlesFilter(subtitles);

//     await new Promise<void>((resolve, reject) => {
//         Object.keys(assets).forEach((x) => {
//             const asset = assets[x](config);

//             if (!asset.options || !asset.audioFilters) {
//                 ffmpegCommand.input(asset.path);
//             }

//             if (asset.options) {
//                 ffmpegCommand.inputOptions(asset.options);
//             }

//             if (asset.audioFilters) {
//                 ffmpegCommand.audioFilters(asset.audioFilters);
//             }
//         });

//         subtitles?.forEach((_, index) => {
//             if (subtitles?.[index]?.word) {
//                 ffmpegCommand.input(getAssetsPath(`text${index}.png`));
//             }
//         });

//         ffmpegCommand
//             .complexFilter(subtitlesFilters)
//             .on("end", () => console.log("Subtitles added to video successfully"))
//             .on("error", (err: Error) => console.error("Error:", err.message))
//             .run();

//         ffmpegCommand
//             .videoCodec("libx264")
//             .outputOptions([
//                 // YUV color space with 4:2:0 chroma subsampling for maximum compatibility with
//                 // video players
//                 "-pix_fmt yuv420p",
//             ])

//             // Set the output duration. It is required because FFmpeg would otherwise
//             // automatically set the duration to the longest input, and the soundtrack might
//             // be longer than the desired video length
//             .duration(config.duration)
//             // Set output frame rate
//             .fps(config.frameRate)

//             // Resolve or reject (throw an error) the Promise once FFmpeg completes
//             .saveToFile(config.outputFilePath)
//             .on("end", () => resolve())
//             .on("error", (error) => reject(new Error(error)));
//     });
// };
