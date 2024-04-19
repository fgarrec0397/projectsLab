import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { FileSystemService } from "src/common/files-system/services/file-system.service";
import { CanvasRendererService } from "src/modules/canvas-renderer/canvas-renderer.service";

import { AssFileBuilder } from "../builders/ass-file.builder";
import { ComplexFilterBuilder } from "../builders/video-complexfilter.builder";
import { Text } from "../entities/Text";
import { ComponentConfig } from "../factories/video-element-component.factory";
import { TimedText } from "../video-renderer.types";
import { BaseComponent } from "./BaseComponent";
import { FragmentableComponent, IFragmentableComponent } from "./FragmentableComponent";

export type TextComponentConfig = ComponentConfig;

export class TextComponent
    // extends FragmentableComponent<Text>
    extends BaseComponent<Text>
{
    // implements IFragmentableComponent<Text["value"]>
    assFileBuilder: AssFileBuilder;

    fileSystem: FileSystemService;

    constructor(
        element: Text,
        complexFilterBuilder: ComplexFilterBuilder,
        assFileBuilder: AssFileBuilder,
        // private readonly canvasRenderer: CanvasRendererService,
        private readonly config: TextComponentConfig
    ) {
        super(element, complexFilterBuilder);
        // this.canvasRenderer = canvasRenderer;
        this.fileSystem = new FileSystemService();
        this.assFileBuilder = assFileBuilder;
    }

    async process(ffmpegCommand: ffmpeg.FfmpegCommand): Promise<void> {
        const text = this.element;
        const value = text.value;

        if (!value) {
            return;
        }

        if (typeof value === "string") {
            const { start, end } = text;

            return this.assFileBuilder.addEntry({ start, end, word: value });
        }

        for (const timedText of value) {
            this.assFileBuilder.addEntry(timedText);
        }
    }

    // getFragment() {
    //     return this.element.value;
    // }

    // async fragmentProcess(
    //     ffmpegCommand: ffmpeg.FfmpegCommand,
    //     fragments: string | TimedText[] | undefined
    // ): Promise<void> {
    //     const text = this.element;

    //     if (!text) {
    //         return;
    //     }

    //     if (!fragments) {
    //         return;
    //     }

    //     if (typeof fragments === "string") {
    //         return;
    //     }

    //     if (typeof fragments === "string") {
    //         return this.handleCreateText(ffmpegCommand, {
    //             id: text.id,
    //             textValue: fragments,
    //             start: text.start,
    //             end: text.end,
    //         });
    //     }

    //     for (const { timedText, valueIndex } of fragments.map((x, index) => ({
    //         timedText: x,
    //         valueIndex: index,
    //     }))) {
    //         console.log(`Creating ${timedText.word} text`);

    //         await this.handleCreateText(ffmpegCommand, {
    //             id: String(valueIndex).padStart(4, "0"),
    //             textValue: timedText.word,
    //             start: timedText.start,
    //             end: timedText.end,
    //         });
    //     }
    // }

    // private async handleCreateText(
    //     ffmpegCommand: ffmpeg.FfmpegCommand,
    //     options: {
    //         id: string;
    //         textValue: string | null | undefined;
    //         start?: number;
    //         end?: number;
    //     }
    // ) {
    //     if (!options.textValue) {
    //         return;
    //     }

    //     const outputFilePath = path.join(
    //         this.config.videoOutputPath,
    //         "subtitles",
    //         `text-${options.id}.png`
    //     );

    //     if (!this.fileSystem.isPathExistSync(this.config.videoOutputPath)) {
    //         this.fileSystem.createDirectory(this.config.videoOutputPath);
    //     }

    //     await this.canvasRenderer.createTextImage(
    //         options.textValue,
    //         outputFilePath,
    //         this.element.styles
    //     );

    //     ffmpegCommand.input(outputFilePath);

    //     this.complexFilterBuilder.addOverlayOnVideo({
    //         start: options.start,
    //         end: options.end,
    //     });
    // }
}
