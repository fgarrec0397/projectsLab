import { Injectable } from "@nestjs/common";
import S3StorageManager from "src/common/services/s3-storage-manager.service";

@Injectable()
export class FilesService {
    constructor(private readonly s3StorageManager: S3StorageManager) {}

    async getUserFiles(userId: string) {
        return this.s3StorageManager.listFiles(userId);
    }
}
