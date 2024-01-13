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
        console.log({
            width: this.config.width,
            height: this.config.height,
        });

        const canvas = createCanvas(this.config.width, this.config.height);
        const context = canvas.getContext("2d");

        // Set the text style
        context.font = "bold 48px Arial"; // Adjust font and size as needed
        context.fillStyle = "yellow"; // Text color
        context.textAlign = "center"; // Center-align text
        context.textBaseline = "middle"; // Align text middle
        context.strokeStyle = "black"; // Text outline color
        context.lineWidth = 8; // Text outline width

        // Add text outline first to ensure it's behind the fill
        context.strokeText(text, canvas.width / 2, canvas.height / 2);

        console.log(canvas.width, canvas.height, "canvas.width, canvas.height");

        // Then add the text fill
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // context.fillStyle = "#0000";
        // context.fillRect(0, 0, this.config.width, this.config.height);
        // context.font = "200px Arial";
        // context.fillStyle = "white";
        // context.fillText(text, 50, 100);

        const buffer = canvas.toBuffer("image/png");

        await promises.writeFile(filename, buffer);
    }
}
