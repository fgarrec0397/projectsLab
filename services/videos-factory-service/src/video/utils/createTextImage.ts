import { createCanvas } from "canvas";
import { writeFileSync } from "fs";

export const createTextImage = (
    text: string,
    filename: string,
    width: number = 1280,
    height: number = 720
): void => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#0000";
    context.fillRect(0, 0, width, height);
    context.font = "200px Arial";
    context.fillStyle = "white";
    context.fillText(text, 50, 100);

    const buffer = canvas.toBuffer("image/png");
    writeFileSync(filename, buffer);
};
