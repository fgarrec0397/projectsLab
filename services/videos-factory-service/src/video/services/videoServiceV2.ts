import { Canvas, CanvasRenderingContext2D, Image, loadImage, registerFont } from "canvas";
import ffmpegStatic from "ffmpeg-static";
import { setFfmpegPath } from "fluent-ffmpeg";
import fs from "fs";

import { getAssetsPath } from "../../core/utils/getAssetsPath";
import { VideoAsset, VideoConfig } from "../controllers/v1/videoController";
import { filterAssetsType } from "../utils/filterAssetsType";
import { getVideoFrameReader } from "../utils/getVideoFrameReader";
import { mergeFrames } from "../utils/mergeFrames";
import { SceneService } from "./sceneService";

// Tell fluent-ffmpeg where it can find FFmpeg
setFfmpegPath(ffmpegStatic || "");

export type VideoSize = {
    width: number;
    height: number;
};

export type VideoOptions = {
    duration: number;
    frameRate: number;
    size: VideoSize;
};

export class VideoService {
    inVideoAssets: VideoAsset[];

    finalAssets: VideoAsset[];

    canvas: Canvas;

    canvasContext: CanvasRenderingContext2D;

    config: VideoConfig;

    sceneService: SceneService;

    videosReaders?: (() => Promise<Image>)[];

    constructor(config: VideoConfig, assets: VideoAsset[]) {
        this.finalAssets = filterAssetsType(assets, config, "final-render");
        this.inVideoAssets = filterAssetsType(assets, config, "in-video");
        this.config = config;

        this.canvas = new Canvas(config.size.width, config.size.height);
        this.canvasContext = this.canvas.getContext("2d");

        this.sceneService = new SceneService(this.canvasContext);

        this.cleanUpDirectories();
        this.registerFonts();
    }

    async renderVideo() {
        await this.initRenderVideo();
        const logo = await loadImage(getAssetsPath("logo.svg"));

        // Render each frame
        for (let i = 0; i < this.config.frameCount; i++) {
            const time = i / this.config.frameRate;

            // eslint-disable-next-line no-console
            console.log(`Rendering frame ${i} at ${Math.round(time * 10) / 10} seconds...`);

            // Clear the canvas with a white background color. This is required as we are
            // reusing the canvas with every frame
            this.canvasContext.fillStyle = "#ffffff";
            this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Grab a frame from our input videos
            const image1 = await this.videosReaders?.[0]();
            const image2 = await this.videosReaders?.[1]();
            const image3 = await this.videosReaders?.[2]();

            if (!image1 || !image2 || !image3) {
                break;
            }

            this.sceneService.renderScenes(
                { image1, image2, image3, logo },
                { width: this.config.size.width, height: this.config.size.height, time }
            );

            // Store the image in the directory where it can be found by FFmpeg
            const output = this.canvas.toBuffer("image/png");
            const paddedNumber = String(i).padStart(4, "0");
            await fs.promises.writeFile(
                getAssetsPath(`tmp/output/frame-${paddedNumber}.png`),
                output
            );
        }

        this.finishRenderVideo();
    }

    private async initRenderVideo() {
        this.videosReaders = [];

        for (const [index, assetFunc] of this.inVideoAssets.entries()) {
            const asset = assetFunc(this.config);

            console.log(`Extracting frames from ${asset.name}...`);

            const getVideoFrame = await getVideoFrameReader(
                asset.path,
                getAssetsPath(`tmp/${asset.name}-${index}`),
                this.config.frameRate
            );

            this.videosReaders.push(getVideoFrame);
        }
    }

    private async finishRenderVideo() {
        // Merge all frames together with FFmpeg
        await mergeFrames(this.finalAssets, this.config);
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
