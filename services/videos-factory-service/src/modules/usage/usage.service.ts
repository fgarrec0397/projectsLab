import { Injectable } from "@nestjs/common";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { NotificationsService } from "../notifications/services/notifications.service";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.types";

@Injectable()
export class UsageService {
    constructor(
        @InjectStorageConfig() private readonly storage: StorageConfig,
        private readonly notificationService: NotificationsService,
        private readonly usersService: UsersService
    ) {}

    async updateUserStorageUsage(userId: string, optimisticValue = 0) {
        const generatedVideosPath = `system/${userId}/videos`;
        const filesStorage = await this.storage.calculateFolderSize(userId);
        const generatedVideosStorage = await this.storage.calculateFolderSize(generatedVideosPath);
        const usedStorage = filesStorage + generatedVideosStorage + optimisticValue;

        await this.usersService.updateUser(userId, {
            usedStorage: this.bytesToGigabytes(usedStorage),
        });

        const user = await this.usersService.getUserById(userId);
        console.log(user, "user in updateUserStorageUsage");

        this.notifyUsageChange(user);
    }

    async addUserVideosUsage(userId: string) {
        const user = await this.usersService.getUserById(userId);

        await this.usersService.updateUser(userId, {
            usedVideos: user.usedVideos + 1,
        });

        this.notifyUsageChange({ ...user, usedVideos: user.usedVideos + 1 });
    }

    async deleteUserVideosUsage(userId: string) {
        const user = await this.usersService.getUserById(userId);

        await this.usersService.updateUser(userId, {
            usedVideos: user.usedVideos - 1,
        });

        this.notifyUsageChange({ ...user, usedVideos: user.usedVideos + 1 });
    }

    bytesToGigabytes(bytes: number): number {
        return Math.round((bytes / 1024 ** 3) * 100) / 100;
    }

    private notifyUsageChange(user: User) {
        this.notificationService.notifyClient(user.id, {
            event: "usageUpdate",
            data: user,
            // cacheKey: [getVideosCacheKey(userId), getVideoByIdCacheKey(video.id)],
        });
    }
}
