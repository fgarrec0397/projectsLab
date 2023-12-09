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
            getAssetsPath("mock-voiceover-subtitles.json")
        );

        const videoData = [
            {
                asset: "video1",
                startTime: 0,
                endTime: 1,
            },
            {
                asset: "video2",
                startTime: 1,
                endTime: 2,
            },
            // {
            //     asset: "video1",
            //     startTime: 0,
            //     endTime: 4,
            // },
            // {
            //     asset: "video2",
            //     startTime: 4,
            //     endTime: 14,
            // },
            // {
            //     asset: "video3",
            //     startTime: 14,
            //     endTime: 24,
            // },
            // {
            //     asset: "video4",
            //     startTime: 24,
            //     endTime: 27,
            // },
            // {
            //     asset: "video5",
            //     startTime: 27,
            //     endTime: 31,
            // },
            // {
            //     asset: "video6",
            //     startTime: 31,
            //     endTime: 59,
            // },
            // {
            //     asset: "video7",
            //     startTime: 59,
            //     endTime: 63,
            // },
            // {
            //     asset: "video8",
            //     startTime: 63,
            //     endTime: 98,
            // },
            // {
            //     asset: "video9",
            //     startTime: 98,
            //     endTime: 111,
            // },
        ];

        const subtitles = mapSubtitles(timedSubtitles?.[0]);

        const templateModule = new TemplateModule(templateKey, videoData);

        const video = new VideoService(templateModule, subtitles);

        await video.renderVideo();

        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();
