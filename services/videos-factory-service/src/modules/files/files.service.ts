import { Inject, Injectable } from "@nestjs/common";
import { STORAGE_MANAGER_TOKEN } from "src/common/storage/storage-manager";
import { StorageConfig } from "src/config/storage-config.module";

@Injectable()
export class FilesService {
    constructor(@Inject(STORAGE_MANAGER_TOKEN) private readonly storageConfig: StorageConfig) {}

    getUserFiles = async (userId: string) => {
        console.log(this, "this");
        console.log(this.storageConfig, "this.storageConfig");

        return this.storageConfig.getFiles(userId);
    };
}
