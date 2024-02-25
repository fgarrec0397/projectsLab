import ffmpeg from "fluent-ffmpeg";
import { FileSystem } from "src/common/FileSystem";
import { CanvasRendererService } from "src/modules/canvas-renderer/canvas-renderer.service";

import { Text } from "../entities/Text";
import { ComplexFilterBuilder } from "../video-complexfilter.builder";
import { TimedText } from "../video-renderer.types";
import { FragmentableComponent, IFragmentableComponent } from "./FragmentableComponent";

export class TextComponent
    extends FragmentableComponent<Text>
    implements IFragmentableComponent<Text["value"]>
{
    canvasRenderer: CanvasRendererService;

    constructor(
        element: Text,
        complexFilterBuilder: ComplexFilterBuilder,
        canvasRenderer: CanvasRendererService
    ) {
        super(element, complexFilterBuilder);
        this.canvasRenderer = canvasRenderer;
    }

    async process(ffmpegCommand: ffmpeg.FfmpegCommand): Promise<void> {
        const text = this.element;

        if (!text) {
            return;
        }

        if (typeof text.value === "string") {
            return this.handleCreateText(ffmpegCommand, {
                id: text.id,
                textValue: text.value,
                start: text.start,
                end: text.end,
            });
        }
    }

    getFragment() {
        return this.element.value;
    }

    async fragmentProcess(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        fragments: string | TimedText[] | undefined
    ): Promise<void> {
        const text = this.element;

        if (!text) {
            return;
        }

        if (!fragments) {
            return;
        }

        if (typeof fragments === "string") {
            return;
        }

        if (typeof fragments === "string") {
            return this.handleCreateText(ffmpegCommand, {
                id: text.id,
                textValue: fragments,
                start: text.start,
                end: text.end,
            });
        }

        for (const { timedText, valueIndex } of fragments.map((x, index) => ({
            timedText: x,
            valueIndex: index,
        }))) {
            console.log(`Creating ${timedText.word} text`);

            await this.handleCreateText(ffmpegCommand, {
                id: String(valueIndex).padStart(4, "0"),
                textValue: timedText.word,
                start: timedText.start,
                end: timedText.end,
            });
        }
    }

    private async handleCreateText(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        options: {
            id: string;
            textValue: string | null | undefined;
            start?: number;
            end?: number;
        }
    ) {
        if (!options.textValue) {
            return;
        }

        const outputFolderPath = FileSystem.getAssetsPath(`tmp/output`);
        const outputFilePath = FileSystem.getAssetsPath(`tmp/output/text-${options.id}.png`);

        if (!FileSystem.isPathExistSync(outputFolderPath)) {
            FileSystem.createDirectory(outputFolderPath);
        }

        await this.canvasRenderer.createTextImage(
            options.textValue,
            outputFilePath,
            this.element.styles
        );

        ffmpegCommand.input(outputFilePath);

        this.complexFilterBuilder.addOverlayOnVideo({
            start: options.start,
            end: options.end,
        });
    }
}