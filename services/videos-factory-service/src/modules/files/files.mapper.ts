import { Inject, Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { STORAGE_MANAGER_TOKEN } from "src/common/storage/storage-manager";
import { StorageConfig } from "src/config/storage-config.module";

@Injectable()
export class FilesMapper {
    constructor(@Inject(STORAGE_MANAGER_TOKEN) private readonly storageConfig: StorageConfig) {}

    async map(
        userId: string,
        callback: (id: string) => Promise<AWS.S3.ObjectList> | Promise<AWS.S3.Object>
    ) {
        const serviceData = await callback(userId);

        if (Array.isArray(serviceData)) {
            return serviceData.map((x) => this.mapFile(x));
        }

        return this.mapFile(serviceData);
    }

    private mapFile(file: AWS.S3.Object) {
        return {
            id: file.Key || "",
            name: this.storageConfig.getFileName(file.Key) || "",
            size: file.Size || 0,
            type: this.storageConfig.getFileExtension(file.Key) || "",
            url: `${this.storageConfig.getBaseUrl()}/${encodeURIComponent(file.Key)}`,
            createdAt: file.LastModified?.toISOString() ?? new Date().toISOString(),
            modifiedAt: file.LastModified?.toISOString() ?? new Date().toISOString(),
        };
    }
}
