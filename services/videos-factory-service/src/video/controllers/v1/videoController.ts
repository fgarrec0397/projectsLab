import { google } from "@google-cloud/speech/build/protos/protos";
import { Dictionary, PartialBy } from "@projectslab/helpers";
import { Request, Response } from "express";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { loadJson } from "../../../core/utils/loadJson";
import { TemplateModule } from "../../modules/TemplateModule";
import { VideoService } from "../../services/videoService";
import { mapSubtitles } from "../../utils/mappers/mapSubtitles";

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
        const templateKey = "funFactsTemplate";

        const timedSubtitles = loadJson<[google.cloud.speech.v1.IRecognizeResponse]>(
            getAssetsPath("POC-mock-voiceover-subtitles.json")
        );

        const subtitles = mapSubtitles(timedSubtitles?.[0]);

        const templateModule = new TemplateModule(templateKey, subtitles);

        // TODO - give the mapped subtitles to constructor and should have
        //        a complete different function that will render the subtitles
        const video = new VideoService(templateModule, subtitles);

        await video.renderVideo();

        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();
