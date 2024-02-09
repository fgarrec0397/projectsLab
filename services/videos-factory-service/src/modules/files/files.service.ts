import { Injectable } from "@nestjs/common";
import path from "path";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

@Injectable()
export class FilesService {
    constructor(@InjectStorageConfig() private readonly storageConfig: StorageConfig) {}

    getUserFiles = async (userId: string, filesPath?: string) => {
        const userFilesPath = filesPath ? path.join(userId, filesPath) : userId;

        return this.storageConfig.getFiles(userFilesPath);
    };
}
