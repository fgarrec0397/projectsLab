import { Injectable } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";
import { VideoProcessingService } from "src/modules/video-processing/video-processing.service";

import { IVideo, IVideoDraft } from "../videosTypes";

@Injectable()
export class VideosService {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        private readonly videoProcessingService: VideoProcessingService
    ) {}

    async getOrCreateLastVideoDraft(userId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const lastVideoDraft = await this.getLastVideoDraft(userId);

        if (lastVideoDraft) {
            return lastVideoDraft;
        }

        const defaultVideoDraft = {
            id: uidGenerator(),
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
            status: "draft",
        };

        const createdDocument = await this.database.create(videoCollectionPath, defaultVideoDraft);

        return createdDocument;
    }

    async getLastVideoDraft(userId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const lastVideoDraft = await this.database.findWithQuery<IVideoDraft>(videoCollectionPath, [
            { field: "status", operator: "==", value: "draft" },
        ]);

        return lastVideoDraft[0];
    }

    async saveLastVideoDraft(userId: string, videoDraft: IVideoDraft) {
        const videoCollectionPath = `users/${userId}/videos`;

        const updatedDocument = await this.database.update(
            videoCollectionPath,
            videoDraft.documentId,
            videoDraft
        );

        return updatedDocument;
    }

    async startRendering(userId: string, video: IVideo) {
        this.videoProcessingService.renderVideo(video);
    }
}
