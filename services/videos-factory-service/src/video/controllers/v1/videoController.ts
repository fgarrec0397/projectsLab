import { Dictionary, PartialBy } from "@projectslab/helpers";
import { Request, Response } from "express";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { VideoService } from "../../services/videoService";
import { videosAssetsMapper } from "../../utils/mappers/videosAssetsMapper";

export type VideoConfig = {
    duration: number;
    frameRate: number;
    frameCount: number;
    outputFilePath: string;
    size: {
        width: number;
        height: number;
    };
};

export type VideoAssetDictionary = Dictionary<VideoAssetCallback>;

export type VideoAssetCallback = (config: VideoConfig) => VideoAssetDTO;

export type VideoAssetDTO = PartialBy<VideoAsset, "id">;

export type VideoAsset = {
    id: string;
    slug: string;
    name: string;
    type: "image" | "audio" | "video";
    lengthType: "in-video" | "final-render";
    path: string;
    options?: string[];
    audioFilters?: string[];
};

class VideoController {
    async get(request: Request, result: Response) {
        const duration = 9;
        const videoConfig: VideoConfig = {
            duration,
            frameRate: 60,
            frameCount: Math.floor(duration * 60),
            outputFilePath: getAssetsPath("out/video.mp4"),
            size: { width: 1280, height: 720 },
        };

        const videoAssetsDTO: VideoAssetCallback[] = [
            () => ({
                slug: "image1",
                name: "Image 1",
                type: "video",
                lengthType: "in-video",
                path: getAssetsPath("pexels-4782135.mp4"),
            }),
            () => ({
                slug: "image2",
                name: "Image 2",
                type: "video",
                lengthType: "in-video",
                path: getAssetsPath("pexels-3576378.mp4"),
            }),
            () => ({
                slug: "image3",
                name: "Image 3",
                type: "video",
                lengthType: "in-video",
                path: getAssetsPath("pexels-2829177.mp4"),
            }),
            () => ({
                slug: "logo",
                name: "Logo",
                type: "image",
                lengthType: "in-video",
                path: getAssetsPath("logo.svg"),
            }),
            (config) => ({
                slug: "finalFrames",
                name: "Final frames",
                type: "video",
                lengthType: "final-render",
                path: getAssetsPath("tmp/output/frame-%04d.png"),
                options: [
                    // Set input frame rate
                    `-framerate ${config.frameRate}`,
                ],
            }),
            (config) => ({
                slug: "soundtrack",
                name: "Soundtrack",
                type: "video",
                lengthType: "final-render",
                path: getAssetsPath("catch-up-loop-119712.mp3"),
                audioFilters: [
                    // Set input frame rate
                    `afade=out:st=${config.duration - 2}:d=2`,
                ],
            }),
        ];

        const videosAssets = videosAssetsMapper(videoAssetsDTO, videoConfig);

        const video = new VideoService(videoConfig, videosAssets);

        await video.renderVideo();

        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();
