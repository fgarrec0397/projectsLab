import ffmpeg from "fluent-ffmpeg";
import { existsSync, promises } from "fs";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { CanvasRenderer } from "../CanvasRenderer/CanvasRenderer";
import { ComplexFilterBuilder } from "./Builders/ComplexFilterBuilder";
import { IElementComponent } from "./Components/BaseComponent";
import { Audio } from "./Entities/Audio";
import { BaseElement } from "./Entities/BaseElement";
import { Composition } from "./Entities/Composition";
import { RenderableElement } from "./Entities/RenderableElement";
import { Text } from "./Entities/Text";
import { Video } from "./Entities/Video";
import { ElementComponentFactory } from "./Factories/ElementComponentFactory";
import { TemplateMapper } from "./Mappers/TemplateMapper";

export type Template = {
    duration?: number;
    fps: number;
    outputFormat: string;
    width: number;
    height: number;
    elements: BaseElement[];
};

export type TemplateAsset = RenderableElement & {
    decompressPath?: string;
};

export type TemplateText = Text;

export class VideoRenderer {
    static Audio = Audio;

    static Composition = Composition;

    static Text = Text;

    static Video = Video;

    outputPath = getAssetsPath("out/refactor-video.mp4");

    tempOutputPath = getAssetsPath("tmp/videos/refactor-video.mp4");

    assets: TemplateAsset[] = [];

    canvasRenderer: CanvasRenderer;

    complexFilterBuilder: ComplexFilterBuilder;

    templateMapper: TemplateMapper;

    elementsFactory: ElementComponentFactory;

    elements: IElementComponent[] = [];

    textsElements: IElementComponent[] = [];

    ffmpegCommand: ffmpeg.FfmpegCommand;

    textFfmpegCommand: ffmpeg.FfmpegCommand;

    durationPerVideo?: number;

    template: Template;

    constructor(template: Template) {
        this.template = template;
        this.ffmpegCommand = ffmpeg();
        this.textFfmpegCommand = ffmpeg();

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

        this.mapTemplate();
    }

    public async initRender() {
        await this.beforeRender();

        // TODO - Should detect here if we should batch processing elements. If yes, we should make multiple renders

        await this.processVideoElements();

        this.buildComplexFilterCommand();

        await this.renderVideo();

        this.complexFilterBuilder.reset();

        await this.processTextElements();

        await this.renderTextOnVideo();
    }

    private async processVideoElements() {
        // Process each element with the composite pattern
        for (const element of this.elements) {
            await element.process(this.ffmpegCommand, this.template, this.durationPerVideo);
        }
    }

    private async processTextElements() {
        this.textFfmpegCommand.input(this.tempOutputPath);

        // Process each element with the composite pattern
        for (const element of this.textsElements) {
            await element.process(this.textFfmpegCommand, this.template, this.durationPerVideo);
        }
    }

    private buildComplexFilterCommand() {
        const complexFilterCommand = this.complexFilterBuilder.build();
        const complexFilterMapping = this.complexFilterBuilder.getMapping();

        this.ffmpegCommand.complexFilter(complexFilterCommand, complexFilterMapping);
    }

    private async renderVideo() {
        console.log("Rendering started...");
        console.time("Rendering finished");
        return new Promise<void>((resolve, reject) => {
            this.ffmpegCommand
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

    private async renderTextOnVideo() {
        console.log("Rendering started...");
        console.time("Rendering finished");

        const complexFilterCommand = this.complexFilterBuilder.build();
        const complexFilterMapping = this.complexFilterBuilder.getMapping();

        this.textFfmpegCommand.complexFilter(complexFilterCommand, complexFilterMapping);

        return new Promise<void>((resolve, reject) => {
            this.textFfmpegCommand
                .videoCodec("libx264")
                .outputOptions(["-pix_fmt yuv420p"])
                .fps(this.template.fps)
                .on("start", (commandLine) => {
                    console.log(`Spawned Text Ffmpeg with command: ${commandLine}`);
                })
                .on("end", () => {
                    console.timeEnd("Rendering finished");
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
        this.durationPerVideo = this.templateMapper.mapDurationPerVideo();

        this.elements = this.templateMapper.mapTemplateToElements();
        this.textsElements = this.templateMapper.mapTemplateToTexts();
    }

    /**
     * Clean up the temporary directories
     */
    private async cleanUpDirectories() {
        for (const path of [
            getAssetsPath("out"),
            getAssetsPath("tmp/output"),
            getAssetsPath("tmp/inputs-list"),
            getAssetsPath("tmp/videos"),
        ]) {
            if (existsSync(path)) {
                await promises.rm(path, { recursive: true });
            }
            await promises.mkdir(path, { recursive: true });
        }
    }
}
