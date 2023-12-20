import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { join } from "path";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { extractFramesFromVideo } from "../../utils/extractFramesFromVideo";
import { Audio } from "./Entities/Audio";
import { BaseElement } from "./Entities/BaseElement";
import { Composition } from "./Entities/Composition";
import { RenderableElement } from "./Entities/RenderableElement";
import { Video } from "./Entities/Video";

export type Template = {
    duration?: number;
    fps: number;
    outputFormat: string;
    width: number;
    height: number;
    useFrames?: boolean;
    elements: BaseElement[];
};

export type TemplateAsset = RenderableElement & {
    decompressPath?: string;
};

export class VideoFactory {
    static Audio = Audio;

    static Composition = Composition;

    static Video = Video;

    assets: TemplateAsset[];

    template: Template;

    constructor(template: Template) {
        this.template = template;

        this.assets = this.mapTemplateToAssets();

        this.cleanUpDirectories();
    }

    public async render() {
        const numberOfVideos = this.assets.length;
        const durationPerVideo = this.template.duration
            ? this.template.duration / numberOfVideos
            : undefined;

        if (this.template.useFrames) {
            await this.decompressVideos();
        }

        console.log("Rendering frames...");

        const ffmpegCommand = ffmpeg();
        const filterComplex: string[] = [];
        const audioFilterComplex: string[] = [];
        let videoInputIndex = 0;
        let audioInputCount = 0;

        const processElement = (element: BaseElement) => {
            if (element instanceof Composition && element.elements?.length) {
                element.elements.forEach((subElement) => {
                    processElement(subElement); // Recursive call
                });
            } else {
                if (element instanceof Video) {
                    const video = this.assets.find((x) => element.id === x.id);
                    console.log(video, "video");

                    if (!video) {
                        return;
                    }

                    console.log(
                        `Processing video: ${video.sourcePath}, Start: ${video.start}, End: ${video.end}`
                    );

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

                    if (this.template.useFrames) {
                        if (video.decompressPath) {
                            ffmpegCommand.input(video.decompressPath);
                        }

                        // Process as frame sequences
                        inputOptions.push("-framerate", this.template.fps.toString());
                        filterComplex.push(`[${videoInputIndex}:v:0]`);
                        // filterComplex.push(`[${videoInputIndex}:a:0]`); // TODO - check if we need to handle that
                    } else {
                        // Process as video concatenation
                        ffmpegCommand.input(video.sourcePath);
                        filterComplex.push(`[${videoInputIndex}:v:0] [${videoInputIndex}:a:0]`);
                    }

                    ffmpegCommand.inputOptions(inputOptions);
                    videoInputIndex++;
                }

                if (element instanceof Audio) {
                    const audio = this.assets.find((x) => element.id === x.id);
                    if (!audio) {
                        return;
                    }

                    ffmpegCommand.input(audio.sourcePath);
                    audioFilterComplex.push(`[${audioInputCount}:a]`);
                    audioInputCount++;
                }
            }
        };

        this.template.elements.forEach((element) => {
            processElement(element);
        });

        const finalComplexFilter = [];

        if (videoInputIndex > 0) {
            const videoConcatFilter = this.template.useFrames
                ? filterComplex.join(" ") + `concat=n=${videoInputIndex}:v=1:a=0 [v]`
                : filterComplex.join(" ") + `concat=n=${videoInputIndex}:v=1:a=1 [v] [a]`;

            // ffmpegCommand.complexFilter(videoConcatFilter, this.template.useFrames ? ["v"] : ["v", "a"]);
            console.log(videoConcatFilter, "videoConcatFilter");

            finalComplexFilter.push(videoConcatFilter);
        }

        if (audioInputCount > 0) {
            const audioConcatFilter =
                audioFilterComplex.join("") + `amix=inputs=${audioInputCount}[a]`;

            finalComplexFilter.push(audioConcatFilter);
        }

        // ffmpeg -t 10 -i [video1 path] -t 15 -i [video2 path] -t 10 -i [video3 path] -t 10 -i [video4 path] -i [audio path]
        //-filter_complex "[0:v:0] [1:v:0] [2:v:0] [3:v:0] concat=n=4:v=1:a=1 [v] [tempa]; [tempa][4:a] amix=inputs=2 [a]" -map "[v]" -map "[a]" -c:v libx264 -c:a aac -shortest output.mp4

        if (finalComplexFilter.length) {
            ffmpegCommand.complexFilter(
                finalComplexFilter,
                this.template.useFrames ? ["v"] : ["v", "a"]
            );
        }

        console.log("FFmpeg filter complex:", filterComplex.join(" "));
        console.log("Constructed FFmpeg command:", ffmpegCommand._getArguments().join(" "));

        ffmpegCommand
            .videoCodec("libx264")
            .outputOptions(["-pix_fmt yuv420p"])
            .fps(this.template.fps)
            .on("end", () => console.log("Video rendered"))
            .on("error", (err: Error) => console.log("Error: " + err.message))
            .save(getAssetsPath("out/refactor-video.mp4"));
    }

    private mapTemplateToAssets() {
        const assets: RenderableElement[] = [];

        console.log(`Mapping assets`);

        const recursivelyMapAssets = (elements: BaseElement[]) => {
            if (!elements.length) {
                return;
            }

            elements.forEach((x) => {
                if (!(x instanceof BaseElement)) {
                    return;
                }

                if (x instanceof RenderableElement) {
                    assets.push(x);
                }

                if (x instanceof Composition && x.elements?.length) {
                    recursivelyMapAssets(x.elements);
                }
            });
        };

        recursivelyMapAssets(this.template.elements);

        return assets;
    }

    private async decompressVideos() {
        const videos = this.assets.filter((x) => x.type === "video");

        for (const [index, asset] of videos.entries()) {
            console.log(`Extracting frames from video ${asset.name}`);

            const outputPath = join(
                getAssetsPath(`tmp/${asset.name}-${asset.id}`),
                "frame-%04d.png"
            );
            await extractFramesFromVideo(asset.sourcePath, outputPath, this.template.fps);

            this.assets[index].decompressPath = outputPath;
        }
        console.log("Videos frames extracted");
    }

    /**
     * Clean up the temporary directories
     */
    private async cleanUpDirectories() {
        for (const path of [getAssetsPath("out"), getAssetsPath("tmp/output")]) {
            if (fs.existsSync(path)) {
                await fs.promises.rm(path, { recursive: true });
            }
            await fs.promises.mkdir(path, { recursive: true });
        }
    }
}
