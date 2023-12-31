import { CanvasRenderingContext2D, Image } from "canvas";

import { cropVideo } from "../../../utils/cropVideo";

export function renderPolaroidPicture(
    context: CanvasRenderingContext2D,
    image: Image,
    caption: string,
    width: number,
    height: number
) {
    context.save();

    // Set a shadow
    context.shadowBlur = 16;
    context.shadowColor = "rgba(0, 0, 0, 0.22)";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 7;

    // Draw a white rectangle as the frame of the polaroid picture
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    context.restore();

    // Draw the image and make sure it fits in the available space
    cropVideo(context, image, 0.054 * width, 0.0466 * height, 0.8921 * width, 0.8048 * height);

    // Draw the caption
    context.font = `${0.09 * height}px 'Caveat'`;
    context.fillStyle = "black";
    context.fillText(caption, 0.05 * width, 0.95 * height);
}
