import { Injectable } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import admin from "firebase-admin";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";
import { VideoProcessingService } from "src/modules/video-processing/services/video-processing.service";

import { IVideo, IVideoDraft, VideoStatus } from "../videos.types";

@Injectable()
export class VideosService {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        @InjectStorageConfig() private readonly storage: StorageConfig,
        private readonly videoProcessingService: VideoProcessingService
    ) {}

    async getVideos(userId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const videos = await this.database.findWithQuery<IVideo>(videoCollectionPath, {
            orderByField: "createdAt",
            orderByDirection: "desc",
        });

        return videos;
    }

    async getVideoById(userId: string, videoId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const video = await this.database.findOne<IVideo>(videoCollectionPath, videoId);

        return video;
    }

    async getVideoUrlById(userId: string, videoId: string) {
        const video = await this.getVideoById(userId, videoId);

        return this.storage.getFileUrl(video.videoKey);
    }

    async getLastOrDefaultVideoDraft(userId: string) {
        const lastVideoDraft = await this.getLastVideoDraft(userId);

        if (lastVideoDraft) {
            return lastVideoDraft;
        }

        const defaultVideoDraft: IVideoDraft = {
            id: uidGenerator(),
            name: "Your new awesome video",
            location: "",
            age: [18, 36],
            gender: "all",
            language: "en-US",
            interests: undefined,
            challenges: undefined,
            topic: "",
            specificityLevel: "broader",
            structureType: "quickTips",
            pace: "mix",
            moreSpecificities: undefined,
            status: VideoStatus.Draft,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        };

        return defaultVideoDraft;
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

        const updatedDocument = await this.database.createOrUpdate(videoCollectionPath, {
            ...videoDraft,
            updatedAt: new Date().getTime(),
        });

        return updatedDocument;
    }

    async deleteVideo(userId: string, videoId: string) {
        const videoCollectionPath = `users/${userId}/videos`;

        return this.database.delete(videoCollectionPath, videoId);
    }

    async startRendering(userId: string, video: IVideo) {
        const videoCollectionPath = `users/${userId}/videos`;

        const updatedDocument = await this.database.createOrUpdate(videoCollectionPath, {
            ...video,
            updatedAt: new Date().getTime(),
        });

        await this.videoProcessingService.test(userId, video);

        return updatedDocument;
    }
}
