import { exec } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { join } from "path";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { createTextImage } from "../../utils/createTextImage";
import { extractFramesFromVideo } from "../../utils/extractFramesFromVideo";
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
    useFrames?: boolean;
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

    assets: TemplateAsset[] = [];

    canvasRenderer: CanvasRenderer;

    complexFilterBuilder: ComplexFilterBuilder;

    templateMapper: TemplateMapper;

    elementsFactory: ElementComponentFactory;

    elements: IElementComponent[] = [];

    ffmpegCommand: ffmpeg.FfmpegCommand;

    durationPerVideo?: number;

    texts: TemplateText[] = [];

    template: Template;

    constructor(template: Template) {
        this.template = template;
        this.ffmpegCommand = ffmpeg();

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
        // this.cleanUpDirectories();
    }

    public async initRender() {
        if (this.template.useFrames) {
            await this.decompressVideos();
        }

        await this.processElements();

        this.buildComplexFilterCommand();

        this.render();
    }

    private async processElements() {
        // Process each element with the composite pattern
        for (const element of this.elements) {
            await element.process(this.ffmpegCommand, this.template, this.durationPerVideo);
        }
    }

    private buildComplexFilterCommand() {
        const complexFilterCommand = this.complexFilterBuilder.build();
        const complexFilterMapping = this.complexFilterBuilder.getMapping();

        this.ffmpegCommand.complexFilter(complexFilterCommand, complexFilterMapping);
    }

    private render() {
        console.log("Rendering started...");
        console.time("Rendering finished");
        this.ffmpegCommand
            .videoCodec("libx264")
            .outputOptions(["-pix_fmt yuv420p"])
            // .output(getAssetsPath("out/refactor-video.mp4"))
            .fps(this.template.fps)
            .on("start", (commandLine) => {
                console.log(`Spawned Ffmpeg with command: ${commandLine}`);
            })
            .on("end", () => console.timeEnd("Rendering finished"))
            .on("error", (error: Error) => {
                console.log("on error called", error);

                // console.log(`Error - ${error.name}: ${error.message}. Stack: ${error.stack}`);
            })
            .save(getAssetsPath("out/refactor-video.mp4"));
        // .run();

        // const fluentFfmpegCommand = this.ffmpegCommand._getArguments().join(" ");
        // const regex = /(-filter_complex\s+)([^\s-]+.*?)(?=\s+-|\s*$)/g;

        // const formattedCommand = `${fluentFfmpegCommand.replace(regex, (match, p1, p2) => {
        //     return `${p1}"${p2}"`;
        // })} ${getAssetsPath("out/refactor-video.mp4")}`;

        // console.log(formattedCommand, "formattedCommand");

        // exec(`ffmpeg ${formattedCommand}`);

        // TODO - fluent-ffmpeg fail when printing the command. Need to print the command, then apply a regex to it to add quotes to make sure it does not fail
        // Only need to encapsulate the complex filter part into quotes. Make sure to remove line returns to avoid sending multiple commands
        // Working command for the template
        // ffmpeg -t 10 -i C:\\Users\\fgarr\\Documents\\lab\\projectsLab\\services\\videos-factory-service\\assets\\poc\\video1.mp4 -t 15 -i C:\\Users\\fgarr\\Documents\\lab\\projectsLab\\services\\videos-factory-service\\assets\\poc\\video2.mp4 -t 10 -i C:\\Users\\fgarr\\Documents\\lab\\projectsLab\\services\\videos-factory-service\\assets\\poc\\video3.mp4 -t 10 -i C:\\Users\\fgarr\\Documents\\lab\\projectsLab\\services\\videos-factory-service\\assets\\poc\\video4.mp4 -i C:\\Users\\fgarr\\Documents\\lab\\projectsLab\\services\\videos-factory-service\\assets\\poc\\background-music-Blade-Runner2049.mp3 -i C:\\Users\\fgarr\\Documents\\lab\\projectsLab\\services\\videos-factory-service\\assets\\poc\\speech.mp3 -i C:\\Users\\fgarr\\Documents\\lab\\projectsLab\\services\\videos-factory-service\\assets\\poc\\tmp\\output\\text-0037a4bc-2b3c-438d-8db7-05fe343fec9c.png -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a][3:v][3:a]concat=n=4:v=1:a=1[v][a];[a][4:a][5:a]amix=inputs=3[a_out];[v][6:v]overlay=x=0:y=0[v_out]" -map [v_out] -map [a_out] output.mp4

        // Not working
        // -t 10 -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\video1.mp4 -t 15 -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\video2.mp4 -t 10 -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\video3.mp4 -t 10 -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\video4.mp4 -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\background-music-Blade-Runner2049.mp3 -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\speech.mp3 -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\tmp\output\text-e60a94f7-b0a3-4fd9-a898-19fce90a4813.png -y -filter_complex [0:v] [0:a] [1:v] [1:a] [2:v] [2:a] [3:v] [3:a]concat=n=4:v=1:a=1 [v] [a];[a][4:a][5:a]amix=inputs=3[a_out];[v][6:v]overlay:x=0:y=0[v_out] -map [v_out] -map [a_out] -vcodec libx264 -r 60 -pix_fmt yuv420p C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\out\refactor-video.mp4
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

    private mapTemplate() {
        this.assets = this.templateMapper.mapTemplateToAssets();

        this.texts = this.templateMapper.mapTemplateToTexts();

        this.durationPerVideo = this.templateMapper.mapDurationPerVideo();

        this.elements = this.templateMapper.mapTemplateToElements();
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
