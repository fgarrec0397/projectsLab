import { Injectable } from "@nestjs/common";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { UsersService } from "../users/users.service";

@Injectable()
export class UsageService {
    constructor(
        @InjectStorageConfig() private readonly storage: StorageConfig,
        private readonly usersService: UsersService
    ) {}

    async updateUserUsage(userId: string) {
        const generatedVideosPath = `system/${userId}`;
        const filesStorage = await this.storage.calculateFolderSize(userId);
        const generatedVideosStorage = await this.storage.calculateFolderSize(generatedVideosPath);
        console.log({ filesStorage, generatedVideosStorage });
    }
}
