import { Canvas, CanvasRenderingContext2D, createCanvas } from "canvas";
import { promises } from "fs";

export type TextStylesProperties = {
    font?: string;
    fillStyle?: string;
    textAlign?: string;
    textBaseline?: string;
    strokeStyle?: string;
    lineWidth?: number;
};

export type CanvasRendererConfig = {
    width: number;
    height: number;
};

const defaultStyles: TextStylesProperties = {
    font: "bold 48px Arial",
    fillStyle: "white",
    textAlign: "center",
    textBaseline: "middle",
    strokeStyle: "black",
    lineWidth: 8,
};

export class CanvasRenderer {
    canvas: Canvas;

    context: CanvasRenderingContext2D;

    config: CanvasRendererConfig;

    constructor(config: CanvasRendererConfig) {
        this.canvas = createCanvas(config.width, config.height);
        this.context = this.canvas.getContext("2d");
        this.config = config;
    }

    async createTextImage(text: string, filename: string, styles?: TextStylesProperties) {
        const canvas = createCanvas(this.config.width, this.config.height);
        const context = canvas.getContext("2d");
        const textStyles = { ...defaultStyles, ...styles };
        let shouldDisplayStroke = false;

        Object.keys(textStyles).forEach((x) => {
            if (x === "strokeStyle" && (textStyles as any)[x] && (textStyles as any)[x] !== "") {
                shouldDisplayStroke = true;
            }

            (context as any)[x] = (textStyles as any)[x];
        });

        if (shouldDisplayStroke) {
            context.strokeText(text, canvas.width / 2, canvas.height / 2);
        }

        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const buffer = canvas.toBuffer("image/png");

        await promises.writeFile(filename, buffer);
    }
}
