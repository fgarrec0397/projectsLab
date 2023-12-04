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

    context.fillStyle = "#0000"; // Transparent background
    context.fillRect(0, 0, width, height);
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText(text, 50, 100); // Adjust text position as needed

    const buffer = canvas.toBuffer("image/png");
    writeFileSync(filename, buffer);
};
