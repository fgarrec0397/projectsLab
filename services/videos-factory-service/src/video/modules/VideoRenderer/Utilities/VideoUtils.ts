import ffmpeg, { ffprobe } from "fluent-ffmpeg";

export class VideoUtils {
    static async resampleAudio(inputFile: string, outputFile: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                .audioFrequency(16000)
                .toFormat("wav")
                .on("error", (error: Error) => {
                    reject(error.message);
                })
                .on("end", () => {
                    console.log("Resampling finished !");
                    resolve();
                })
                .save(outputFile);
        });
    }

    static async getVideoDuration(filePath: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            ffprobe(filePath, (err, metadata) => {
                if (err) {
                    reject(err);
                    return;
                }
                const duration = metadata.format.duration || 0;
                resolve(duration);
            });
        });
    }
}
