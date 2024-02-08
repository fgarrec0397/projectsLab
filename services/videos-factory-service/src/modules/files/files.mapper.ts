import { Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { FolderStructure } from "./files.type";

type UnwrappedPromise<T> = T extends Promise<infer U> ? U : T;

@Injectable()
export class FilesMapper {
    constructor(@InjectStorageConfig() private readonly storageConfig: StorageConfig) {}

    async map(userId: string, callback: StorageConfig["getFiles"] | StorageConfig["getFile"]) {
        const serviceData = await callback(userId);

        if (Array.isArray(serviceData)) {
            console.log(JSON.stringify(serviceData), "serviceData");

            return this.buildFolderStructure(serviceData);
        }

        return this.mapFile(serviceData);
    }

    private mapFile(file: AWS.S3.Object) {
        const pathArray = file.Key.split("/");

        pathArray.shift();

        const path = pathArray.join("/");

        return {
            id: file.Key || "",
            name: this.storageConfig.getFileName(file.Key) || "",
            size: file.Size || 0,
            type: this.storageConfig.getFileExtension(file.Key) || "",
            path,
            url: `${this.storageConfig.getBaseUrl()}/${encodeURIComponent(file.Key)}`,
            createdAt: file.LastModified?.toISOString() ?? new Date().toISOString(),
            modifiedAt: file.LastModified?.toISOString() ?? new Date().toISOString(),
        };
    }

    private buildFolderStructure = (
        files: UnwrappedPromise<ReturnType<StorageConfig["getFiles"]>>
    ): FolderStructure => {
        const root: FolderStructure = {};

        files.forEach((file) => {
            const parts = file.Key.split("/");
            let currentLevel = root;

            parts.shift();

            parts.forEach((part, index) => {
                // if (part !== "") {
                // Check if we are at the last part (the file)
                if (index === parts.length - 1) {
                    currentLevel[part] = this.mapFile(file);
                } else {
                    // If the folder doesn't exist, create it
                    if (!currentLevel[part]) {
                        currentLevel[part] = {};
                    }
                    // Move down the tree
                    currentLevel = currentLevel[part] as FolderStructure;
                }
                // }
            });
        });

        return root;
    };

    private bytesToGigabytes = (bytes: number): number => {
        return bytes / Math.pow(1024, 3);
    };
}
