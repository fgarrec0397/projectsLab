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

        if (typeof text.value === "string") {
            const outputFolderPath = getAssetsPath(`tmp/output`);
            const outputFilePath = getAssetsPath(`tmp/output/text-${text.id}.png`);

            if (!existsSync(outputFolderPath)) {
                mkdirSync(outputFolderPath);
                console.log("Folder created");
            } else {
                console.log("Folder already exists");
            }
            await this.canvasRenderer.createTextImage(text.value, outputFilePath);

            ffmpegCommand.input(outputFilePath);
            this.complexFilterBuilder.addOverlay(text.start, text.end);
        }
    }
}
