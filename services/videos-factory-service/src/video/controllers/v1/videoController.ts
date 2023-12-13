import { Dictionary, PartialBy } from "@projectslab/helpers";
import { Request, Response } from "express";

import { VideoFactory } from "../../modules/VideoFactory/VideoFactory";
import { funFactsTemplate } from "../../templates/funFactsTemplate/funFactsTemplate";

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
        const videoFactory = new VideoFactory(funFactsTemplate);

        await videoFactory.render();
        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();
