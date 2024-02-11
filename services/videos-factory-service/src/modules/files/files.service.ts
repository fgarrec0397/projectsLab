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

    uploadUserFiles = async (
        userId: string,
        files: Array<Express.Multer.File> | Express.Multer.File
    ) => {
        if (Array.isArray(files)) {
            const uploadPromises = files.map((file) => {
                const fileName = `${userId}/${file.originalname}`;
                return this.storageConfig.uploadFile(file, fileName);
            });

            const uploadResults = await Promise.all(uploadPromises);
            return uploadResults;
        }

        const fileName = `${userId}/${files.originalname}`;
        return this.storageConfig.uploadFile(files, fileName);
    };
}
