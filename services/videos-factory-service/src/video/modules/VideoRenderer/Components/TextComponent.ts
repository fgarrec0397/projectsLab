import ffmpeg from "fluent-ffmpeg";
import { existsSync, mkdirSync } from "fs";

import { getAssetsPath } from "../../../../core/utils/getAssetsPath";
import { CanvasRenderer } from "../../CanvasRenderer/CanvasRenderer";
import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Text } from "../Entities/Text";
import { BaseComponent, IElementComponent } from "./BaseComponent";

export class TextComponent extends BaseComponent<Text> implements IElementComponent {
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

        console.log(text, "text");

        const handleCreateText = async (options: {
            id: string;
            textValue: string | null | undefined;
            start?: number;
            end?: number;
            shouldAddInput?: boolean;
        }) => {
            if (!options.textValue) {
                return;
            }

            const outputFolderPath = getAssetsPath(`tmp/output`);
            const outputFilePath = getAssetsPath(`tmp/output/text-${options.id}.png`);

            if (!existsSync(outputFolderPath)) {
                mkdirSync(outputFolderPath);
                console.log("Folder created");
            } else {
                console.log("Folder already exists");
            }

            await this.canvasRenderer.createTextImage(options.textValue, outputFilePath);

            if (options.shouldAddInput) {
                ffmpegCommand.input(outputFilePath);
            }

            this.complexFilterBuilder.addOverlay(options.start, options.end);
        };

        if (typeof text.value === "string") {
            return handleCreateText({
                id: text.id,
                textValue: text.value,
                start: text.start,
                end: text.end,
                shouldAddInput: true,
            });
        }

        console.log(text.value, "text.value");

        for (const { timedText, valueIndex } of text.value.map((x, index) => ({
            timedText: x,
            valueIndex: index,
        }))) {
            console.log(`Creating ${timedText.word} text frame`);

            await handleCreateText({
                id: String(valueIndex).padStart(4, "0"),
                textValue: timedText.word,
                start: timedText.start,
                end: timedText.end,
                shouldAddInput: true,
            });
        }

        // ffmpegCommand.input(getAssetsPath(`tmp/output/text-%04d.png`));
    }
}
