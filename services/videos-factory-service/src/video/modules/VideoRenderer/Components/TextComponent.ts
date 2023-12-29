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

        const handleCreateText = async (
            id: string,
            textValue: string | null | undefined,
            start?: number,
            end?: number
        ) => {
            if (!textValue) {
                return;
            }

            const outputFolderPath = getAssetsPath(`tmp/output`);
            const outputFilePath = getAssetsPath(`tmp/output/text-${id}.png`);

            if (!existsSync(outputFolderPath)) {
                mkdirSync(outputFolderPath);
                console.log("Folder created");
            } else {
                console.log("Folder already exists");
            }

            console.log("before creating text");
            await this.canvasRenderer.createTextImage(textValue, outputFilePath);

            console.log("after creating text");
            ffmpegCommand.input(outputFilePath);
            console.log("after add input text");

            this.complexFilterBuilder.addOverlay(start, end);
        };

        if (typeof text.value === "string") {
            return handleCreateText(text.id, text.value, text.start, text.end);
        }

        for (const { timedText, valueIndex } of text.value.map((x, index) => ({
            timedText: x,
            valueIndex: index,
        }))) {
            console.log(`Creating ${timedText.word} text frame`);

            return handleCreateText(
                String(valueIndex),
                timedText.word,
                timedText.start,
                timedText.end
            );
        }
    }
}
