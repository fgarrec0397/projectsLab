import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import { FindWithQueryOptions } from "src/common/database/strategies/firebase.strategy";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";
import { VideoRenderingJobService } from "src/modules/jobs/services/video-rendering-jobs.service";
import { UsageService } from "src/modules/usage/usage.service";
import { UsersService } from "src/modules/users/users.service";

import { VIDEOS_CACHE_DURATION } from "../videos.constants";
import { IVideo, IVideoDraft, VideoStatus } from "../videos.types";

@Injectable()
export class VideosService {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        @InjectStorageConfig() private readonly storage: StorageConfig,
        @Inject(forwardRef(() => VideoRenderingJobService))
        private readonly videoRenderingJobService: VideoRenderingJobService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => UsageService))
        private readonly usageService: UsageService
    ) {}

    async getVideos(
        userId: string,
        withThumbnails?: boolean,
        options: FindWithQueryOptions = {
            orderByField: "createdAt",
            orderByDirection: "desc",
        }
    ) {
        const videoCollectionPath = `users/${userId}/videos`;
        const videos = await this.database.findWithQuery<IVideo>(videoCollectionPath, options);

        if (!withThumbnails) {
            return videos;
        }

        const videosWithThumbnail = videos.map((x) => ({
            ...x,
            thumbnailUrl: this.storage.getFileUrl(x.thumbnailKey, VIDEOS_CACHE_DURATION),
        }));

        return videosWithThumbnail;
    }

    async getVideoById(userId: string, videoId: string): Promise<IVideo | undefined> {
        const videoCollectionPath = `users/${userId}/videos`;

        try {
            const video = await this.database.findOne<IVideo>(videoCollectionPath, videoId);

            return video;
        } catch (error) {
            throw new Error("Video not found");
        }
    }

    async getVideosByIds(userId: string, videosIds: string[]): Promise<IVideo[]> {
        const videoCollectionPath = `users/${userId}/videos`;

        try {
            const videos = await this.database.findWithQuery<IVideo>(videoCollectionPath, {
                conditions: [
                    ...(videosIds.map((x) => ({
                        field: "id",
                        operator: "==",
                        value: x,
                    })) as FindWithQueryOptions["conditions"]),
                ],
            });

            return videos;
        } catch (error) {
            throw new Error("Video not found");
        }
    }

    async getVideoUrlById(userId: string, videoId: string) {
        const video = await this.getVideoById(userId, videoId);

        if (!video) {
            return;
        }

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

    async updateVideo(userId: string, video: IVideo) {
        const videoCollectionPath = `users/${userId}/videos`;

        const updatedDocument = await this.database.createOrUpdate(videoCollectionPath, {
            ...video,
            updatedAt: new Date().getTime(),
        });

        return updatedDocument;
    }

    async deleteVideo(userId: string, videoId: string) {
        const videoCollectionPath = `users/${userId}/videos`;
        const video = await this.getVideoById(userId, videoId);

        await this.storage.deleteFiles([video.thumbnailKey, video.videoKey]);

        const deleteResult = await this.database.delete(videoCollectionPath, videoId);

        await this.usageService.updateUserStorageUsage(userId);

        return deleteResult;
    }

    async deleteVideosBatch(userId: string, videosIds: string[]) {
        const videoCollectionPath = `users/${userId}/videos`;
        const videos = await this.getVideosByIds(userId, videosIds);

        await this.storage.deleteFiles(videos.map((x) => [x.thumbnailKey, x.videoKey]).flat());

        const deleteResult = await this.database.deleteBatch(videoCollectionPath, videosIds);

        await this.usageService.updateUserStorageUsage(userId);

        return deleteResult;
    }

    async deleteUserVideos(userId: string) {
        const userVideos = await this.getVideos(userId);
        const videosIds = userVideos.map((x) => x.id);

        await this.storage.deleteFiles(userVideos.map((x) => [x.thumbnailKey, x.videoKey]).flat());

        const deleteResult = await this.deleteVideosBatch(userId, videosIds);

        return deleteResult;
    }

    async startRendering(userId: string, video: IVideo) {
        const videoCollectionPath = `users/${userId}/videos`;

        const user = await this.usersService.getUserById(userId);

        if (user.usedVideos >= user.allowedVideos) {
            throw new HttpException(
                "You reached your maximum number of videos",
                HttpStatus.FORBIDDEN
            );
        }

        const updatedDocument = await this.database.createOrUpdate(videoCollectionPath, {
            ...video,
            status: VideoStatus.Queued,
            updatedAt: new Date().getTime(),
        });

        await this.videoRenderingJobService.renderVideo({ userId, video });

        return updatedDocument;
    }
}
