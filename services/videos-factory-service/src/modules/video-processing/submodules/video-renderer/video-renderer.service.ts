import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { CanvasRendererService } from "src/modules/canvas-renderer/canvas-renderer.service";

import { ComplexFilterBuilder } from "./builders/video-complexfilter.builder";
import { IElementComponent } from "./components/BaseComponent";
import { IFragmentableComponent } from "./components/FragmentableComponent";
import { SourceableElement } from "./entities/SourceableElement";
import { Text } from "./entities/Text";
import { ElementComponentFactory } from "./factories/video-element-component.factory";
import { VideoTemplateMapper } from "./mappers/video-template.mapper";
import { Template } from "./video-renderer.types";

export type TemplateAsset = SourceableElement & {
    decompressPath?: string;
};

export type TemplateText = Text;

export type TemplateSize = {
    width: number;
    height: number;
};

export class VideoRendererService {
    cleanUpTempFolder: () => Promise<void>;

    folderPath: string;

    outputPath: string;

    tempOutputPath: string;

    assets: TemplateAsset[] = [];

    canvasRenderer?: CanvasRendererService;

    complexFilterBuilder: ComplexFilterBuilder;

    templateMapper?: VideoTemplateMapper;

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

    constructor(template: Template, folderPath: string) {
        this.tempFfmpegCommand = ffmpeg();
        this.textFfmpegCommand = ffmpeg();
        this.finalFfmpegCommand = ffmpeg();

        this.complexFilterBuilder = new ComplexFilterBuilder();

        this.template = template;
        this.canvasRenderer = new CanvasRendererService({
            width: this.template.width,
            height: this.template.height,
        });
        this.complexFilterBuilder = new ComplexFilterBuilder();
        this.elementsFactory = new ElementComponentFactory(
            this.complexFilterBuilder,
            this.canvasRenderer
        );
        this.templateMapper = new VideoTemplateMapper(this.template, this.elementsFactory);

        this.size = {
            width: this.template.width,
            height: this.template.height,
        };

        this.mapTemplate();

        this.shouldProcessFragments = this.fragmentableElements.length > 0;

        this.folderPath = folderPath;
        this.outputPath = `${this.folderPath}/video.mp4`;
        this.tempOutputPath = `${this.folderPath}/temp-video.mov`;
    }

    public async initRender(afterRender?: (filePath: string) => Promise<void>) {
        await this.processElements();

        this.buildComplexFilterCommand();

        await this.renderTempVideo();

        if (!this.shouldProcessFragments) {
            await this.renderFinalVideo();

            return;
        }

        this.complexFilterBuilder.reset();

        await this.processFragmentElements();

        await this.renderFinalVideo();

        if (afterRender) {
            await afterRender(this.outputPath);
        }
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
                    this.tempOutputPath = `${this.folderPath}/intermediate_${i}.mov`;

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
                    resolve();
                })
                .on("error", (error: Error) => {
                    reject(error);
                })
                .save(this.outputPath);
        });
    }

    private mapTemplate() {
        if (!this.templateMapper) {
            throw new Error("VideoRender.init was not called");
        }

        this.durationPerVideo = this.templateMapper.mapDurationPerVideo();

        this.elements = this.templateMapper.mapTemplateToElements();
        this.fragmentableElements = this.templateMapper.mapTemplateToFragmentableElements();
    }
}
