import { Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { FilesService } from "../services/files.service";

type FilesMapperData = {
    userId: string;
    path?: string;
    all?: boolean;
};

@Injectable()
export class FilesMapper {
    data: FilesMapperData;

    constructor(@InjectStorageConfig() private readonly storageConfig: StorageConfig) {}

    async map(data: FilesMapperData, callback: FilesService["getUserFiles"]) {
        const serviceData = await callback(data.userId, data.path, data.all);

        this.data = data;

        if (Array.isArray(serviceData)) {
            return serviceData.map(this.mapFile);
        }

        return this.mapFile(serviceData);
    }

    private mapFile = (file: AWS.S3.Object) => {
        const pathArray = file.Key.split("/");

        pathArray.shift();

        const path = pathArray.join("/");
        const name = this.storageConfig.getFileName(file.Key);

        if (name === this.data.userId) {
            return;
        }

        return {
            id: file.Key || "",
            name: this.storageConfig.getFileName(file.Key) || "",
            size: file.Size || 0,
            type: this.storageConfig.getFileExtension(file.Key) || "folder",
            path,
            url: this.storageConfig.getFileUrl(file.Key),
            createdAt: file.LastModified?.toISOString() ?? new Date().toISOString(),
            modifiedAt: file.LastModified?.toISOString() ?? new Date().toISOString(),
        };
    };
}
