import { Dictionary, PartialBy } from "@projectslab/helpers";
import { Request, Response } from "express";

import { VideoService } from "../../services/videoService";
import { templates } from "../../templates/templates";

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
        const templateKey = "tutorialTemplate";

        const template = templates[templateKey];

        const video = new VideoService(template);

        await video.renderVideo();

        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();
