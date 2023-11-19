import { Canvas, CanvasRenderingContext2D, loadImage } from "canvas";
import ffmpegStatic from "ffmpeg-static";
import { setFfmpegPath } from "fluent-ffmpeg";
import fs from "fs";

import { stitchFramesToVideo } from "./videoService";

// Tell fluent-ffmpeg where it can find FFmpeg
setFfmpegPath(ffmpegStatic || "");

export const renderVideo = async () => {
    // Clean up the temporary directories first
    for (const path of ["out", "tmp/output"]) {
        if (fs.existsSync(path)) {
            await fs.promises.rm(path, { recursive: true });
        }
        await fs.promises.mkdir(path, { recursive: true });
    }

    const canvas = new Canvas(1280, 720);
    const context = canvas.getContext("2d");

    const logo = await loadImage("assets/logo.svg");

    // The video length and frame rate, as well as the number of frames required
    // to create the video
    const duration = 3;
    const frameRate = 60;
    const frameCount = Math.floor(duration * frameRate);

    // Render each frame
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;

        // eslint-disable-next-line no-console
        console.log(`Rendering frame ${i} at ${Math.round(time * 10) / 10} seconds...`);

        // Clear the canvas with a white background color. This is required as we are
        // reusing the canvas with every frame
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderFrame(context, duration, time);

        // Store the image in the directory where it can be found by FFmpeg
        const output = canvas.toBuffer("image/png");
        const paddedNumber = String(i).padStart(4, "0");
        await fs.promises.writeFile(`tmp/output/frame-${paddedNumber}.png`, output);
    }

    // Stitch all frames together with FFmpeg
    await stitchFramesToVideo(
        "tmp/output/frame-%04d.png",
        "assets/catch-up-loop-119712.mp3",
        "out/video.mp4",
        duration,
        frameRate
    );

    function renderFrame(
        canvasContext: CanvasRenderingContext2D,
        frameDuration: number,
        time: number
    ) {
        // Calculate the progress of the animation from 0 to 1
        const t = time / frameDuration;

        // Draw the image from left to right over a distance of 550 pixels
        canvasContext.drawImage(logo, 100 + t * 550, 100, 500, 500);
    }
};
