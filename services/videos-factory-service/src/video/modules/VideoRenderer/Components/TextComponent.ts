import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { existsSync, mkdirSync, promises, readdirSync } from "fs";
import path from "path";

import { getAssetsPath } from "../../../../core/utils/getAssetsPath";
import { TimedText } from "../../../utils/mappers/mapSubtitles";
import { CanvasRenderer } from "../../CanvasRenderer/CanvasRenderer";
import { ComplexFilterBuilder } from "../Builders/ComplexFilterBuilder";
import { Text } from "../Entities/Text";
import { BaseComponent, IElementComponent } from "./BaseComponent";

const overlayDir: string = getAssetsPath("tmp/output");
const batchSize: number = 10; // Adjust based on your needs

// async function overlayImagesInBatches(): Promise<void> {
//     const imageFiles: string[] = readdirSync(overlayDir);
//     let currentVideo: string | undefined = undefined;

//     for (let i = 0; i < imageFiles.length; i += batchSize) {
//         const batch: string[] = imageFiles.slice(i, i + batchSize);
//         const outputVideo: string = `intermediate_${i}.mp4`;
//         await processBatch(batch, outputVideo, currentVideo);
//         currentVideo = outputVideo; // Use the output of the current batch as the input for the next
//     }

//     // Final output is in currentVideo
//     console.log(`Final video is available at: ${currentVideo}`);
// }

// function processBatch(batch: string[], outputVideo: string, inputVideo?: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//         const command: FfmpegCommand = ffmpeg(inputVideo);

//         batch.forEach((file) => {
//             command.input(path.join(overlayDir, file));
//             // You may need to set input options depending on your overlay requirements
//         });

//         command
//             .complexFilter(generateFilter(batch))
//             .videoCodec("prores_ks") // Using ProRes
//             .outputOptions("-profile:v 3") // High-quality profile
//             .on("end", () => resolve())
//             .on("error", (err) => reject(err))
//             .save(outputVideo);
//     });
// }

export interface IFragmentableComponent<T = any> {
    getFragment: () => T;
    fragmentProcess: (ffmpegCommand: ffmpeg.FfmpegCommand, fragments: T) => Promise<void>;
}

export class TextComponent
    extends BaseComponent<Text>
    implements IElementComponent, IFragmentableComponent<Text["value"]>
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

        const handleCreateText = async (options: {
            id: string;
            textValue: string | null | undefined;
            start?: number;
            end?: number;
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

            ffmpegCommand.input(outputFilePath);

            this.complexFilterBuilder.addOverlay(options.start, options.end);
        };

        // getAssetsPath("tmp/inputs-list")

        if (typeof text.value === "string") {
            return handleCreateText({
                id: text.id,
                textValue: text.value,
                start: text.start,
                end: text.end,
            });
        }

        // TODO if an array, should store the inputs in a txt file
        // for (const { timedText, valueIndex } of text.value.map((x, index) => ({
        //     timedText: x,
        //     valueIndex: index,
        // }))) {
        //     console.log(`Creating ${timedText.word} text frame`);

        //     await handleCreateText({
        //         id: String(valueIndex).padStart(4, "0"),
        //         textValue: timedText.word,
        //         start: timedText.start,
        //         end: timedText.end,
        //     });
        //     console.log("after handleCreateText");
        // }

        // ffmpegCommand.input(getAssetsPath("tmp/inputs-list/text-overlay.txt"));
    }

    getFragment() {
        return this.element.value;
    }

    async fragmentProcess(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        fragments: string | TimedText[]
    ): Promise<void> {
        console.log(fragments, "fragments");

        if (typeof fragments === "string") {
            return;
        }

        console.log(this.complexFilterBuilder, "this.complexFilterBuilder in Text component");

        const handleCreateText = async (options: {
            id: string;
            textValue: string | null | undefined;
            start?: number;
            end?: number;
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

            ffmpegCommand.input(outputFilePath);

            this.complexFilterBuilder.addOverlay(options.start, options.end);
        };

        for (const { timedText, valueIndex } of fragments.map((x, index) => ({
            timedText: x,
            valueIndex: index,
        }))) {
            console.log(`Creating ${timedText.word} text frame`);

            await handleCreateText({
                id: String(valueIndex).padStart(4, "0"),
                textValue: timedText.word,
                start: timedText.start,
                end: timedText.end,
            });
            console.log("after handleCreateText");
        }
        // fragments.forEach((fragment, index) => {
        //     handleCreateText({
        //         id: String(index),
        //         textValue: fragment.word,
        //         start: fragment.start,
        //         end: fragment.end,
        //     });
        //     // You may need to set input options depending on your overlay requirements
        // });
    }
}
