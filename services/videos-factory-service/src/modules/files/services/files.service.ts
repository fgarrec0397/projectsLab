import { Injectable } from "@nestjs/common";
import path from "path";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";
import { UsageService } from "src/modules/usage/usage.service";

@Injectable()
export class FilesService {
    constructor(
        @InjectStorageConfig() private readonly storageConfig: StorageConfig,
        private readonly usageService: UsageService
    ) {}

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
        console.log("uploadUserFiles");

        if (Array.isArray(files)) {
            const uploadPromises = files.map((file) => {
                const fileName = `${userId}/${file.originalname}`;
                return this.storageConfig.uploadFile(file, fileName);
            });

            const uploadResults = await Promise.all(uploadPromises);
            await this.usageService.updateUserUsage(userId);

            return uploadResults;
        }

        const fileName = `${userId}/${files.originalname}`;
        const uploadResult = await this.storageConfig.uploadFile(files, fileName);

        await this.usageService.updateUserUsage(userId);

        return uploadResult;
    };

    renameFile = async (userId: string, filePath: string, newFileName: string) => {
        const userFilePath = `${userId}/${filePath}`;
        const userFilePathArray = userFilePath.split("/");

        const isFolder = userFilePathArray.pop() === "";

        if (isFolder) {
            userFilePathArray.pop();
        }

        userFilePathArray.push(isFolder ? `${newFileName}/` : newFileName);

        const newUserFileName = userFilePathArray.join("/");

        if (isFolder) {
            return this.storageConfig.renameFolder(userFilePath, newUserFileName);
        }

        return this.storageConfig.renameFile(userFilePath, newUserFileName);
    };

    createFolder = async (userId: string, folderName: string) => {
        const userFolderName = `${userId}/${folderName}`;
        return this.storageConfig.createFolder(userFolderName);
    };

    delete = async (fileIds: string[]) => {
        return this.storageConfig.deleteFiles(fileIds);
    };
}
