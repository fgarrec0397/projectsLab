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
                    console.log("Resampled finished: " + outputFile);
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

    static async hasAudioStream(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            ffprobe(filePath, (err, metadata) => {
                if (err) {
                    reject(err);
                    return;
                }
                const audioStreams = metadata.streams.filter(
                    (stream) => stream.codec_type === "audio"
                );
                resolve(audioStreams.length > 0);
            });
        });
    }

    static async addSilentAudioToVideo(inputFile: string, outputFile: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ffmpeg()
                // Input silent audio
                .input("anullsrc=channel_layout=stereo:sample_rate=44100")
                .inputFormat("lavfi")
                // Input video
                .input(inputFile)
                // Copy video codec, encode audio to AAC
                .outputOptions(["-c:v copy", "-c:a aac", "-shortest"])
                .on("error", (err) => {
                    reject("An error occurred: " + err.message);
                })
                .on("end", () => {
                    resolve();
                })
                .save(outputFile);
        });
    }
}
