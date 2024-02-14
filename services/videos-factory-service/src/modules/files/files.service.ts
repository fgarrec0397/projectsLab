import { Injectable } from "@nestjs/common";
import path from "path";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

@Injectable()
export class FilesService {
    constructor(@InjectStorageConfig() private readonly storageConfig: StorageConfig) {}

    getUserFiles = async (userId: string, filesPath?: string, shouldFetchAll?: boolean) => {
        let userFilesPath = filesPath ? path.join(userId, filesPath) : userId;

        if (shouldFetchAll) {
            userFilesPath = path.join(userId, "**_no_delimiter_!**");
        }

        const files = await this.storageConfig.getFiles(userFilesPath);

        return files;
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

    renameFile = async (userId: string, fileName: string, newFileName: string) => {
        const userFileName = `${userId}/${fileName}`;
        const newUserFileName = `${userId}/${newFileName}`;

        return this.storageConfig.renameFile(userFileName, newUserFileName);
    };

    createFolder = async (userId: string, folderName: string) => {
        const userFolderName = `${userId}/${folderName}`;
        return this.storageConfig.createFolder(userFolderName);
    };
}
