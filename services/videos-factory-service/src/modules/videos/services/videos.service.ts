import { Injectable } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import admin from "firebase-admin";
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

    async getVideoById(userId: string, videoId) {
        const videoCollectionPath = `users/${userId}/videos`;
        const video = await this.database.findOne<IVideo>(videoCollectionPath, videoId);

        return video;
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
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
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
            updatedAt: admin.firestore.Timestamp.now(),
        });

        return updatedDocument;
    }

    async deleteVideo(userId: string, videoId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        console.log(videoId, "videoId");

        return this.database.delete(videoCollectionPath, videoId);
    }

    async startRendering(userId: string, video: IVideo) {
        const videoCollectionPath = `users/${userId}/videos`;

        const updatedDocument = await this.database.createOrUpdate(videoCollectionPath, {
            ...video,
            updatedAt: admin.firestore.Timestamp.now(),
        });

        this.videoProcessingService.renderVideo(userId, video);

        return updatedDocument;
    }
}
