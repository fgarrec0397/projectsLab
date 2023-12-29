import { Canvas, CanvasRenderingContext2D, registerFont } from "canvas";
import ffmpegStatic from "ffmpeg-static";
import { setFfmpegPath } from "fluent-ffmpeg";
import fs from "fs";

import { getAssetsPath } from "../../core/utils/getAssetsPath";
import { VideoAssetDictionary, VideoConfig } from "../controllers/v1/videoController";
import { TemplateModule } from "../modules/TemplateModule";
import { createTextImage } from "../utils/createTextImage";
import { filterAssets } from "../utils/filters/filterAssets";
import { getVideoFrameReader } from "../utils/getVideoFrameReader";
import { mapAssetsToImages } from "../utils/mappers/mapAssetsToImages";
import { mapReadersToAssets } from "../utils/mappers/mapReadersToAssets";
import { TimedText } from "../utils/mappers/mapSubtitles";
import { mapVideoConfigToSceneConfig } from "../utils/mappers/mapVideoConfigToSceneConfig";
import { mapVideosAssets } from "../utils/mappers/mapVideosAssets";
import { mergeFrames } from "../utils/mergeFrames";
import { VideoReader } from "./servicesTypes";

// Tell fluent-ffmpeg where it can find FFmpeg
setFfmpegPath(ffmpegStatic || "");

export class VideoService {
    finalAssets: VideoAssetDictionary;

    videosAssets: VideoAssetDictionary;

    imagesAssets: VideoAssetDictionary;

    canvas: Canvas;

    canvasContext: CanvasRenderingContext2D;

    config: VideoConfig;

    subtitles: TimedText[];

    templateModule: TemplateModule;

    videosReaders?: VideoReader[];

    constructor(templateModule: TemplateModule, subtitles: TimedText[]) {
        this.templateModule = templateModule;
        this.config = templateModule.template.config;
        this.canvas = templateModule.canvas;
        this.canvasContext = templateModule.canvasContext;
        this.subtitles = subtitles;

        const videosAssets = mapVideosAssets(
            templateModule.template.assets,
            templateModule.template.config
        );

        this.finalAssets = filterAssets(videosAssets, this.config, {
            lengthType: "final-render",
        });
        this.videosAssets = filterAssets(videosAssets, this.config, {
            lengthType: "in-video",
            type: "video",
        });
        this.imagesAssets = filterAssets(videosAssets, this.config, {
            lengthType: "in-video",
            type: "image",
        });

        this.cleanUpDirectories();
        this.registerFonts();
    }

    async renderVideo() {
        await this.initRenderVideo();

        await this.renderFrames();

        this.renderSubtitles();

        this.finishRenderVideo();
    }

    private async initRenderVideo() {
        this.videosReaders = [];

        for (const key of Object.keys(this.videosAssets)) {
            const asset = this.videosAssets[key](this.config);

            console.log(`Extracting frames from ${asset.name}...`);

            const getVideoFrame = await getVideoFrameReader(
                asset.path,
                getAssetsPath(`tmp/${asset.name}-${key}`),
                this.config.frameRate
            );

            this.videosReaders.push({ slug: asset.slug, callback: getVideoFrame });
        }
    }

    private async renderFrames() {
        const images = await mapAssetsToImages(this.config, this.imagesAssets);

        // Render each frame
        for (let i = 0; i < this.config.frameCount; i++) {
            const currentTime = i / this.config.frameRate;

            console.log(`Rendering frame ${i} at ${Math.round(currentTime * 10) / 10} seconds...`);

            // Clear the canvas with a white background color. This is required as we are
            // reusing the canvas with every frame
            this.canvasContext.fillStyle = "#ffffff";
            this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Extract all the assets from their according readers
            const assets = await mapReadersToAssets(this.videosReaders);
            const scenesConfig = mapVideoConfigToSceneConfig(this.config, currentTime);

            this.templateModule.renderTemplates({ ...assets, ...images }, scenesConfig);

            // Store the image in the directory where it can be found by FFmpeg
            const output = this.canvas.toBuffer("image/png");
            const paddedNumber = String(i).padStart(4, "0");
            await fs.promises.writeFile(
                getAssetsPath(`tmp/output/frame-${paddedNumber}.png`),
                output
            );
        }
    }

    private renderSubtitles() {
        if (!this.subtitles.length) {
            return console.log("No subtitles to render. Moving forward!");
        }

        this.subtitles.forEach((subtitle, index) => {
            if (subtitle.word) {
                console.log(`Rendering subtitle: ${subtitle.word}`);

                createTextImage(subtitle.word, getAssetsPath(`tmp/output/text-${index}.png`));
            }
        });
    }

    private async finishRenderVideo() {
        // Merge all frames together with FFmpeg
        await mergeFrames(this.finalAssets, this.config, this.subtitles);
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
