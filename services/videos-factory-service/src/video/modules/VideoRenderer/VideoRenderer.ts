import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { existsSync, promises } from "fs";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { Template } from "../../videoTypes";
import { CanvasRenderer } from "../CanvasRenderer/CanvasRenderer";
import { ComplexFilterBuilder } from "./Builders/ComplexFilterBuilder";
import { IElementComponent } from "./Components/BaseComponent";
import { IFragmentableComponent } from "./Components/TextComponent";
import { Audio } from "./Entities/Audio";
import { Composition } from "./Entities/Composition";
import { RenderableElement } from "./Entities/RenderableElement";
import { Text } from "./Entities/Text";
import { Video } from "./Entities/Video";
import { ElementComponentFactory } from "./Factories/ElementComponentFactory";
import { TemplateMapper } from "./Mappers/TemplateMapper";

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

    tempBlankVideoPath = getAssetsPath("tmp/videos/blank.mp4");

    assets: TemplateAsset[] = [];

    canvasRenderer: CanvasRenderer;

    complexFilterBuilder: ComplexFilterBuilder;

    templateMapper: TemplateMapper;

    elementsFactory: ElementComponentFactory;

    elements: IElementComponent[] = [];

    fragmentableElements: (IElementComponent & IFragmentableComponent)[] = [];

    ffmpegCommand: ffmpeg.FfmpegCommand;

    textFfmpegCommand: ffmpeg.FfmpegCommand;

    durationPerVideo?: number;

    template: Template;

    shouldProcessFragments: boolean;

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

        this.shouldProcessFragments = this.fragmentableElements.length > 0;
    }

    public async initRender() {
        await this.beforeRender();

        await this.processVideoElements();

        this.buildComplexFilterCommand();

        await this.renderVideo();

        if (!this.shouldProcessFragments) {
            return;
        }

        this.complexFilterBuilder.reset();

        await this.processFragmentElements();
    }

    private async processVideoElements() {
        for (const element of this.elements) {
            await element.process(this.ffmpegCommand, this.template, this.durationPerVideo);
        }
    }

    private async processFragmentElements() {
        const batchSize = 50;

        for (const element of this.fragmentableElements) {
            const fragments = element.getFragment();

            if (Array.isArray(fragments)) {
                let currentVideoPath = this.tempOutputPath;

                for (let i = 0; i < fragments.length; i += batchSize) {
                    const batch: string[] = fragments.slice(i, i + batchSize);
                    const outputVideo: string = getAssetsPath(`tmp/videos/intermediate_${i}.mov`);

                    await this.processBatch(batch, outputVideo, element, currentVideoPath);

                    currentVideoPath = outputVideo;

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
                .outputOptions("-profile:v 3")
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

    private async beforeRender() {
        await this.cleanUpDirectories();
    }

    private mapTemplate() {
        this.durationPerVideo = this.templateMapper.mapDurationPerVideo();

        this.elements = this.templateMapper.mapTemplateToElements();
        this.fragmentableElements = this.templateMapper.mapTemplateToFragmentableElements();
    }

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
