import ffmpeg from "fluent-ffmpeg";
import { existsSync, mkdirSync } from "fs";

import { FilesSystem } from "../../../../core/modules/FilesSystem";
import { TimedText } from "../../../videoTypes";
import { CanvasRenderer } from "../../CanvasRenderer/CanvasRenderer";
import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Text } from "../Entities/Text";
import { FragmentableComponent, IFragmentableComponent } from "./FragmentableComponent";

export class TextComponent
    extends FragmentableComponent<Text>
    implements IFragmentableComponent<Text["value"]>
{
    canvasRenderer: CanvasRenderer;

    constructor(
        element: Text,
        complexFilterBuilder: ComplexFilterBuilder,
        canvasRenderer: CanvasRenderer
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
        fragments: string | TimedText[]
    ): Promise<void> {
        const text = this.element;

        if (!text) {
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

        const outputFolderPath = FilesSystem.getAssetsPath(`tmp/output`);
        const outputFilePath = FilesSystem.getAssetsPath(`tmp/output/text-${options.id}.png`);

        if (!existsSync(outputFolderPath)) {
            mkdirSync(outputFolderPath);
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
