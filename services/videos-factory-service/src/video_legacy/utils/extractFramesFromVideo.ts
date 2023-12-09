import ffmpeg from "fluent-ffmpeg";
import { existsSync, mkdirSync } from "fs";
import path from "path";

// Example usage: await extractFramesFromVideo('video.mp4', 'frame-%04d.png', 60);

export const extractFramesFromVideo = async (
    inputFilepath: string,
    outputFilepath: string,
    frameRate: number
) => {
    await new Promise<void>((resolve, reject) => {
        // Ensure the output directory exists
        const outputDir = path.dirname(outputFilepath);
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true });
        }

        ffmpeg()
            // Specify the filepath to the video
            .input(inputFilepath)

            // Instruct FFmpeg to extract frames at this rate regardless of the video's frame rate
            .fps(frameRate)

            // Save frames to this directory
            .saveToFile(outputFilepath)

            .on("end", () => resolve())
            .on("error", (error) => reject(new Error(error)));
    });
};
