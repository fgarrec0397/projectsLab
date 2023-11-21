import { Canvas, CanvasRenderingContext2D, loadImage, registerFont } from "canvas";
import ffmpegStatic from "ffmpeg-static";
import { setFfmpegPath } from "fluent-ffmpeg";
import fs from "fs";

import { getAssetsPath } from "../../core/utils/getAssetsPath";
import { renderMainComposition } from "../compositions/renderMainComposition";
import { getVideoFrameReader } from "../utils/getVideoFrameReader";
import { mergeFrames } from "../utils/mergeFrames";
import { SceneService } from "./sceneService";

// Tell fluent-ffmpeg where it can find FFmpeg
setFfmpegPath(ffmpegStatic || "");

export type VideoOptions = {
    duration: number;
    frameRate: number;
    size: {
        width: number;
        height: number;
    };
};

export class VideoService {
    canvas: Canvas;

    canvasContext: CanvasRenderingContext2D;

    duration: number;

    frameRate: number;

    frameCount: number;

    constructor({ duration, frameRate, size }: VideoOptions) {
        this.canvas = new Canvas(size.width, size.height);
        this.canvasContext = this.canvas.getContext("2d");

        this.duration = duration;
        this.frameRate = frameRate;
        this.frameCount = Math.floor(duration * frameRate);

        this.cleanUpDirectories();
        this.registerFonts();
    }

    async renderVideo() {
        console.log("Extracting frames from video 1...");
        const getVideo1Frame = await getVideoFrameReader(
            getAssetsPath("pexels-4782135.mp4"),
            getAssetsPath("tmp/video-1"),
            this.frameRate
        );

        console.log("Extracting frames from video 2...");
        const getVideo2Frame = await getVideoFrameReader(
            getAssetsPath("pexels-3576378.mp4"),
            getAssetsPath("tmp/video-2"),
            this.frameRate
        );

        console.log("Extracting frames from video 3...");
        const getVideo3Frame = await getVideoFrameReader(
            getAssetsPath("pexels-2829177.mp4"),
            getAssetsPath("tmp/video-3"),
            this.frameRate
        );

        const logo = await loadImage(getAssetsPath("logo.svg"));

        // TODO - need to move this code in the loop.So We should instantiate our class here then call renderScene in the loop
        const scene = new SceneService(this.canvasContext, { image1, image2, image3, logo }, {});

        // Render each frame
        for (let i = 0; i < this.frameCount; i++) {
            const time = i / this.frameRate;

            // eslint-disable-next-line no-console
            console.log(`Rendering frame ${i} at ${Math.round(time * 10) / 10} seconds...`);

            // Clear the canvas with a white background color. This is required as we are
            // reusing the canvas with every frame
            this.canvasContext.fillStyle = "#ffffff";
            this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Grab a frame from our input videos
            const image1 = await getVideo1Frame();
            const image2 = await getVideo2Frame();
            const image3 = await getVideo3Frame();

            renderMainComposition(
                this.canvasContext,
                image1,
                image2,
                image3,
                logo,
                this.canvas.width,
                this.canvas.height,
                time
            );

            // Store the image in the directory where it can be found by FFmpeg
            const output = this.canvas.toBuffer("image/png");
            const paddedNumber = String(i).padStart(4, "0");
            await fs.promises.writeFile(
                getAssetsPath(`tmp/output/frame-${paddedNumber}.png`),
                output
            );
        }

        // Stitch all frames together with FFmpeg
        await mergeFrames(
            getAssetsPath("tmp/output/frame-%04d.png"),
            getAssetsPath("catch-up-loop-119712.mp3"),
            getAssetsPath("out/video.mp4"),
            this.duration,
            this.frameRate
        );
    }

    /**
     * Clean up the temporary directories
     */
    private async cleanUpDirectories() {
        for (const path of [getAssetsPath("out"), getAssetsPath("tmp/output")]) {
            if (fs.existsSync(path)) {
                await fs.promises.rm(path, { recursive: true });
            }
            await fs.promises.mkdir(path, { recursive: true });
        }
    }

    /**
     * Register the fonts needed
     */
    private registerFonts() {
        registerFont(getAssetsPath("caveat-medium.ttf"), { family: "Caveat" });
        registerFont(getAssetsPath("chivo-regular.ttf"), { family: "Chivo" });
    }
}
