import { Canvas, CanvasRenderingContext2D, createCanvas } from "canvas";
import { promises } from "fs";

export type CanvasRendererConfig = {
    width: number;
    height: number;
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

    // TODO - make the text configurable
    async createTextImage(text: string, filename: string) {
        const canvas = createCanvas(this.config.width, this.config.height);
        const context = canvas.getContext("2d");

        context.fillStyle = "#0000";
        context.fillRect(0, 0, this.config.width, this.config.height);
        context.font = "200px Arial";
        context.fillStyle = "white";
        context.fillText(text, 50, 100);

        const buffer = canvas.toBuffer("image/png");

        await promises.writeFile(filename, buffer);
    }
}
