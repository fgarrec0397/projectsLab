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
    name: string;
    type: "in-video" | "final-render";
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
                name: "image 1",
                type: "in-video",
                path: getAssetsPath("pexels-4782135.mp4"),
            }),
            () => ({
                name: "image 2",
                type: "in-video",
                path: getAssetsPath("pexels-3576378.mp4"),
            }),
            () => ({
                name: "image 3",
                type: "in-video",
                path: getAssetsPath("pexels-2829177.mp4"),
            }),
            (config) => ({
                name: "final frames",
                type: "final-render",
                path: getAssetsPath("tmp/output/frame-%04d.png"),
                options: [
                    // Set input frame rate
                    `-framerate ${config.frameRate}`,
                ],
            }),
            (config) => ({
                name: "soundtrack",
                type: "final-render",
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
