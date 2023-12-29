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
        this.context.save();

        this.context.fillStyle = "#0000";
        this.context.fillRect(0, 0, this.config.width, this.config.height);
        this.context.font = "200px Arial";
        this.context.fillStyle = "white";
        this.context.fillText(text, 50, 100);

        const buffer = this.canvas.toBuffer("image/png");

        await promises.writeFile(filename, buffer);

        this.context.restore();
    }
}
