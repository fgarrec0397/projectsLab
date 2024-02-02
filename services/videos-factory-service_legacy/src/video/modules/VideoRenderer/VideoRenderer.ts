import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";

import { FileSystem } from "../../../core/modules/FileSystem";
import { Template } from "../../videoTypes";
import { CanvasRenderer } from "../CanvasRenderer/CanvasRenderer";
import { ComplexFilterBuilder } from "./Builders/ComplexFilterBuilder";
import { IElementComponent } from "./Components/BaseComponent";
import { IFragmentableComponent } from "./Components/FragmentableComponent";
import { Audio } from "./Entities/Audio";
import { Composition } from "./Entities/Composition";
import { SourceableElement } from "./Entities/SourceableElement";
import { Text } from "./Entities/Text";
import { Video } from "./Entities/Video";
import { ElementComponentFactory } from "./Factories/ElementComponentFactory";
import { TemplateMapper } from "./Mappers/TemplateMapper";

export type TemplateAsset = SourceableElement & {
    decompressPath?: string;
};

export type TemplateText = Text;

export type TemplateSize = {
    width: number;
    height: number;
};

export class VideoRenderer {
    static Audio = Audio;

    static Composition = Composition;

    static Text = Text;

    static Video = Video;

    outputPath = FileSystem.getAssetsPath("out/refactor-video.mp4");

    tempOutputPath = FileSystem.getAssetsPath("tmp/videos/temp-video.mov");

    assets: TemplateAsset[] = [];

    canvasRenderer?: CanvasRenderer;

    complexFilterBuilder: ComplexFilterBuilder;

    templateMapper?: TemplateMapper;

    elementsFactory?: ElementComponentFactory;

    elements: IElementComponent[] = [];

    fragmentableElements: (IElementComponent & IFragmentableComponent)[] = [];

    tempFfmpegCommand: ffmpeg.FfmpegCommand;

    textFfmpegCommand: ffmpeg.FfmpegCommand;

    finalFfmpegCommand: ffmpeg.FfmpegCommand;

    durationPerVideo?: number;

    template?: Template;

    size?: TemplateSize;

    shouldProcessFragments?: boolean;

    constructor() {
        this.tempFfmpegCommand = ffmpeg();
        this.textFfmpegCommand = ffmpeg();
        this.finalFfmpegCommand = ffmpeg();

        this.complexFilterBuilder = new ComplexFilterBuilder();
    }

    public init(template: Template) {
        this.template = template;
        this.canvasRenderer = new CanvasRenderer({
            width: this.template.width,
            height: this.template.height,
        });
        this.complexFilterBuilder = new ComplexFilterBuilder();
        this.elementsFactory = new ElementComponentFactory(
            this.complexFilterBuilder,
            this.canvasRenderer
        );
        this.templateMapper = new TemplateMapper(this.template, this.elementsFactory);

        this.size = {
            width: this.template.width,
            height: this.template.height,
        };

        this.mapTemplate();

        this.shouldProcessFragments = this.fragmentableElements.length > 0;
    }

    public async initRender() {
        console.time("Video Rendered");
        await this.beforeRender();

        await this.processElements();

        this.buildComplexFilterCommand();

        await this.renderTempVideo();

        if (!this.shouldProcessFragments) {
            await this.renderFinalVideo();

            console.timeEnd("Video Rendered");
            return;
        }

        this.complexFilterBuilder.reset();

        await this.processFragmentElements();

        await this.renderFinalVideo();

        console.timeEnd("Video Rendered");
    }

    private async processElements() {
        if (!this.size || !this.template) {
            throw new Error("VideoRender.init was not called");
        }

        this.complexFilterBuilder.setCrop(this.size);

        for (const element of this.elements) {
            await element.process(this.tempFfmpegCommand, this.template, this.durationPerVideo);
            await element.handleVideoDuration(this.tempFfmpegCommand);
        }
    }

    private async processFragmentElements() {
        if (!this.size || !this.template) {
            throw new Error("VideoRender.init was not called");
        }

        const batchSize = 125;

        for (const element of this.fragmentableElements) {
            const fragments = element.getFragment();

            if (Array.isArray(fragments)) {
                let currentVideoPath = this.tempOutputPath;

                for (let i = 0; i < fragments.length; i += batchSize) {
                    const batch: string[] = fragments.slice(i, i + batchSize);
                    this.tempOutputPath = FileSystem.getAssetsPath(
                        `tmp/videos/intermediate_${i}.mov`
                    );

                    this.complexFilterBuilder.setCrop(this.size);

                    await this.processBatch(batch, this.tempOutputPath, element, currentVideoPath);

                    currentVideoPath = this.tempOutputPath;

                    this.complexFilterBuilder.reset();
                }
            } else {
                await element.process(this.textFfmpegCommand, this.template, this.durationPerVideo);
            }
        }
    }

    private async processBatch(
        batch: string[],
        outputVideo: string,
        element: IElementComponent & IFragmentableComponent<any>,
        inputVideo?: string
    ): Promise<void> {
        console.time(`Intermediate ${outputVideo} rendering finished`);
        return new Promise(async (resolve, reject) => {
            const command: FfmpegCommand = ffmpeg(inputVideo);

            await element.fragmentProcess(command, batch);

            const complexFilter = this.complexFilterBuilder.build();
            const videoMapping = this.complexFilterBuilder.getMapping()[0];
            const audioMapping = this.complexFilterBuilder.getMapping()[1];
            command
                .complexFilter(complexFilter)
                .addOption("-map", `[${videoMapping}]`)
                .addOption("-map", audioMapping)
                .videoCodec("prores_ks")
                .outputOptions("-profile:v 3");

            command
                .on("start", (commandLine) => {
                    console.log(`Spawned processBatch Ffmpeg with command: ${commandLine}`);
                })
                .on("end", () => {
                    console.timeEnd(`Intermediate ${outputVideo} rendering finished`);
                    resolve();
                })
                .on("error", (err) => reject(err))
                .save(outputVideo);
        });
    }

    private buildComplexFilterCommand() {
        const complexFilterCommand = this.complexFilterBuilder.build();
        const complexFilterMapping = this.complexFilterBuilder.getMapping();

        this.tempFfmpegCommand.complexFilter(complexFilterCommand, complexFilterMapping);
    }

    private async renderTempVideo() {
        console.log("Rendering started...");
        console.time("Rendering finished");
        return new Promise<void>((resolve, reject) => {
            if (!this.template?.fps) {
                throw new Error("VideoRender.init was not called");
            }

            this.tempFfmpegCommand
                .videoCodec("libx264")
                .outputOptions(["-pix_fmt yuv420p"])
                .fps(this.template.fps)
                .on("start", (commandLine) => {
                    console.log(`Spawned Ffmpeg with command: ${commandLine}`);
                })
                .on("end", () => {
                    console.timeEnd("Rendering finished");
                    resolve();
                })
                .on("error", (error: Error) => {
                    reject(error);
                })
                .save(this.tempOutputPath);
        });
    }

    private async renderFinalVideo() {
        if (!this.template) {
            throw new Error("VideoRender.init was not called");
        }
        console.log("Final rendering started...");
        console.time("Final rendering finished");
        console.log(this.tempOutputPath, "this.tempOutputPath");

        return new Promise<void>((resolve, reject) => {
            if (!this.template) {
                throw new Error("VideoRender.init was not called");
            }

            this.finalFfmpegCommand
                .input(this.tempOutputPath)
                .videoCodec("libx264")
                .outputOptions(["-pix_fmt yuv420p"])
                .fps(this.template.fps)
                .on("start", (commandLine) => {
                    console.log(`Spawned Ffmpeg with command: ${commandLine}`);
                })
                .on("end", () => {
                    console.timeEnd("Final rendering finished");
                    resolve();
                })
                .on("error", (error: Error) => {
                    reject(error);
                })
                .save(this.outputPath);
        });
    }

    private async beforeRender() {
        await this.cleanUpDirectories();
    }

    private mapTemplate() {
        if (!this.templateMapper) {
            throw new Error("VideoRender.init was not called");
        }

        this.durationPerVideo = this.templateMapper.mapDurationPerVideo();

        this.elements = this.templateMapper.mapTemplateToElements();
        this.fragmentableElements = this.templateMapper.mapTemplateToFragmentableElements();
    }

    private async cleanUpDirectories() {
        for (const path of [
            FileSystem.getAssetsPath("out"),
            FileSystem.getAssetsPath("tmp/output"),
            FileSystem.getAssetsPath("tmp/inputs-list"),
            FileSystem.getAssetsPath("tmp/videos"),
        ]) {
            await FileSystem.removeFile(path);
            await FileSystem.createDirectory(path);
        }
    }
}
