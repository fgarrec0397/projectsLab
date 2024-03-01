import { Injectable } from "@nestjs/common";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";
import { VideoProcessingService } from "src/modules/video-processing/video-processing.service";

import { IVideo, IVideoDraft, VideoStatus } from "../videos.types";

@Injectable()
export class VideosService {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        private readonly videoProcessingService: VideoProcessingService
    ) {}

    async getVideos(userId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const videos = await this.database.findWithQuery<IVideo>(videoCollectionPath, {
            orderByField: "createdAt",
            orderByDirection: "asc",
        });

        return videos;
    }

    async getOrCreateLastVideoDraft(userId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const lastVideoDraft = await this.getLastVideoDraft(userId);

        if (lastVideoDraft) {
            return lastVideoDraft;
        }

        const defaultVideoDraft = {
            name: "Your new awesome video",
            location: "",
            age: [18, 36],
            gender: "all",
            language: "en-US",
            interests: undefined,
            challenges: undefined,
            contentType: "",
            specificityLevel: "broader audience",
            structureType: "quick tips",
            pace: "mix",
            moreSpecificities: undefined,
            status: VideoStatus.Draft,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const createdDocument = await this.database.create(videoCollectionPath, defaultVideoDraft);
        const { id } = createdDocument;

        return {
            ...defaultVideoDraft,
            id,
        };
    }

    async getLastVideoDraft(userId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const lastVideoDraft = await this.database.findWithQuery<IVideoDraft>(videoCollectionPath, {
            conditions: [{ field: "status", operator: "==", value: "draft" }],
        });

        return lastVideoDraft[0];
    }

    async saveLastVideoDraft(userId: string, videoDraft: IVideoDraft) {
        const videoCollectionPath = `users/${userId}/videos`;

        const updatedDocument = await this.database.update(
            videoCollectionPath,
            videoDraft.id,
            videoDraft
        );

        return updatedDocument;
    }

    async startRendering(userId: string, video: IVideo) {
        const videoCollectionPath = `users/${userId}/videos`;

        const updatedDocument = await this.database.update(videoCollectionPath, video.id, video);

        this.videoProcessingService.renderVideo(userId, video);

        return updatedDocument;
    }
}
