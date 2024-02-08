import { Injectable } from "@nestjs/common";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

@Injectable()
export class FilesService {
    constructor(@InjectStorageConfig() private readonly storageConfig: StorageConfig) {}

    getUserFiles = async (userId: string) => {
        return this.storageConfig.getFiles(userId);
    };
}
