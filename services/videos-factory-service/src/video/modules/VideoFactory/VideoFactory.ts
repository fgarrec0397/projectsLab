import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { join } from "path";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { createTextImage } from "../../utils/createTextImage";
import { extractFramesFromVideo } from "../../utils/extractFramesFromVideo";
import { ComplexFilterBuilder } from "./Builders/ComplexFilterBuilder";
import { Audio } from "./Entities/Audio";
import { BaseElement } from "./Entities/BaseElement";
import { Composition } from "./Entities/Composition";
import { RenderableElement } from "./Entities/RenderableElement";
import { Text } from "./Entities/Text";
import { Video } from "./Entities/Video";
import { TemplateMapper } from "./Mappers/TemplateMapper";

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

export type TemplateText = Text;

export class VideoFactory {
    static Audio = Audio;

    static Composition = Composition;

    static Text = Text;

    static Video = Video;

    assets: TemplateAsset[];

    ffmpegCommand: ffmpeg.FfmpegCommand;

    durationPerVideo?: number;

    texts: TemplateText[];

    template: Template;

    constructor(template: Template) {
        this.template = template;

        this.ffmpegCommand = ffmpeg();

        const templateMapper = new TemplateMapper(this.template);

        this.assets = templateMapper.mapTemplateToAssets();

        this.texts = templateMapper.mapTemplateToTexts();

        this.durationPerVideo = templateMapper.mapDurationPerVideo();

        this.cleanUpDirectories();
    }

    public async initRender() {
        if (this.template.useFrames) {
            await this.decompressVideos();
        }
        this.buildCommand();
        this.render();
    }

    private buildCommand() {
        const complexFilterBuilder = new ComplexFilterBuilder();

        const processElement = (element: BaseElement) => {
            if (element instanceof Composition && element.elements?.length) {
                element.elements.forEach((subElement) => {
                    processElement(subElement); // Recursive call
                });
            } else {
                if (element instanceof Video) {
                    const video = this.assets.find((x) => element.id === x.id);

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

                        if (!this.durationPerVideo) {
                            return [];
                        }

                        return ["-t", this.durationPerVideo.toString()];
                    };

                    // Init input options
                    const inputOptions = [...getVideoDurationCommand()];

                    if (this.template.useFrames) {
                        if (video.decompressPath) {
                            this.ffmpegCommand.input(video.decompressPath);
                        }

                        // Process as frame sequences
                        inputOptions.push("-framerate", this.template.fps.toString());
                        complexFilterBuilder.addVideo();
                    } else {
                        // Process as video concatenation
                        this.ffmpegCommand.input(video.sourcePath);
                        complexFilterBuilder.addVideoWithAudio();
                    }

                    this.ffmpegCommand.inputOptions(inputOptions);
                }

                if (element instanceof Audio) {
                    const audio = this.assets.find((x) => element.id === x.id);
                    if (!audio) {
                        return;
                    }

                    this.ffmpegCommand.input(audio.sourcePath);
                    complexFilterBuilder.addAudio();
                }
            }
        };

        this.template.elements.forEach((element) => {
            processElement(element);
        });

        const complexFilterCommand = complexFilterBuilder.build();
        const complexFilterMapping = complexFilterBuilder.getMapping();

        this.ffmpegCommand.complexFilter(complexFilterCommand, complexFilterMapping);

        console.log("Constructed FFmpeg command:", this.ffmpegCommand._getArguments().join(" "));
    }

    private render() {
        console.log("Rendering started...");
        console.time("Rendering finished");
        this.ffmpegCommand
            .videoCodec("libx264")
            .outputOptions(["-pix_fmt yuv420p"])
            .fps(this.template.fps)
            .on("end", () => console.timeEnd("Rendering finished"))
            .on("error", (err: Error) => console.log("Error: " + err.message))
            .save(getAssetsPath("out/refactor-video.mp4"));
    }

    // TODO - use the same process as the legacy feature as it is pretty fast to render substiles
    private renderText() {
        if (!this.texts.length) {
            return console.log("No texts to render. Moving forward!");
        }

        if (this.texts.length === 1) {
            createTextImage(this.texts[0].value, getAssetsPath(`tmp/output/text-0.png`));
        }

        this.texts.forEach((text, index) => {
            if (text.value) {
                console.log(`Rendering text: ${text.value}`);

                createTextImage(text.value, getAssetsPath(`tmp/output/text-${index}.png`));
            }
        });
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
