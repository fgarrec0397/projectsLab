import { Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import S3StorageManager from "src/common/services/s3-storage-manager.service";

@Injectable()
export class FilesMapper {
    constructor(private readonly s3StorageManager: S3StorageManager) {}

    async map(
        userId: string,
        callback: (id: string) => Promise<AWS.S3.ObjectList> | Promise<AWS.S3.Object>
    ) {
        const serviceData = await callback(userId);

        console.log(this, "this");
        console.log(this.s3StorageManager, "this.s3StorageManager");

        if (Array.isArray(serviceData)) {
            return serviceData.map((x) => this.mapFile(x));
        }

        return this.mapFile(serviceData);
    }

    private mapFile(file: AWS.S3.Object) {
        return {
            id: file.Key || "",
            name: this.s3StorageManager.extractFileName(file.Key) || "",
            size: file.Size || 0,
            type: this.s3StorageManager.getFileExtension(file.Key) || "",
            url: `https://${this.s3StorageManager.getBucketName()}.s3.amazonaws.com/${encodeURIComponent(
                file.Key
            )}`,
            createdAt: file.LastModified?.toISOString() ?? new Date().toISOString(),
            modifiedAt: file.LastModified?.toISOString() ?? new Date().toISOString(),
        };
    }
}
