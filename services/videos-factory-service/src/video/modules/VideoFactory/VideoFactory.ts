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
    duration: number;
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
        if (this.template.useFrames) {
            await this.decompressVideos();
        }

        console.log("Rendering frames...");

        const ffmpegCommand = ffmpeg();
        const filterComplex: string[] = [];
        let inputIndex = 0;

        const processElement = (element: BaseElement, track: number) => {
            if (element instanceof Composition && element.elements?.length) {
                element.elements.forEach((subElement) => {
                    processElement(subElement, element.track); // Recursive call
                });
            } else {
                if (element instanceof Video) {
                    const video = this.assets.find((x) => element.id === x.id);
                    console.log(video, "video");

                    if (!video) {
                        return;
                    }

                    if (this.template.useFrames) {
                        if (video.decompressPath) {
                            ffmpegCommand.input(video.decompressPath);
                        }
                        // Process as frame sequences
                        ffmpegCommand.inputOptions(["-framerate", this.template.fps.toString()]);
                        filterComplex.push(`[${inputIndex}:v:0]`);
                    } else {
                        ffmpegCommand.input(video.sourcePath);
                        // Process as regular video files
                        filterComplex.push(`[${inputIndex}:v:0] [${inputIndex}:a:0]`);
                    }
                    inputIndex++;
                }
            }
        };

        this.template.elements.forEach((element) => {
            processElement(element, 1); // Assuming default track is 1
        });

        if (filterComplex.length > 0) {
            const concatFilter = this.template.useFrames
                ? filterComplex.join(" ") + `concat=n=${inputIndex}:v=1:a=0 [v]`
                : filterComplex.join(" ") + `concat=n=${inputIndex}:v=1:a=1 [v] [a]`;

            ffmpegCommand.complexFilter(concatFilter, this.template.useFrames ? ["v"] : ["v", "a"]);
        }

        console.log(
            "Constructed FFmpeg command:",
            ffmpegCommand._getArguments().join(" "),
            "ffmpegCommand"
        );

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
