import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import path from "path";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";
import { UsageService } from "src/modules/usage/usage.service";
import { UsersService } from "src/modules/users/users.service";

@Injectable()
export class FilesService {
    constructor(
        @InjectStorageConfig() private readonly storageConfig: StorageConfig,
        private readonly usageService: UsageService,
        private readonly usersService: UsersService
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
        const user = await this.usersService.getUserById(userId);
        console.log(files, "files");

        const filesSize = Array.isArray(files)
            ? files.map((x) => x.size).reduce((prev, current) => prev + current)
            : files.size;
        const inComingUsage = this.usageService.bytesToGigabytes(filesSize);
        const totalUsage = user.usedStorage + inComingUsage;

        if (user.usedStorage >= user.allowedStorage) {
            throw new HttpException("You reached your maximum storage", HttpStatus.FORBIDDEN);
        }

        if (totalUsage >= user.allowedStorage) {
            throw new HttpException(
                "Not enough storage, you will reach the maximum storage",
                HttpStatus.FORBIDDEN
            );
        }

        if (Array.isArray(files)) {
            const uploadPromises = files.map((file) => {
                const fileName = `${userId}/${file.originalname}`;
                return this.storageConfig.uploadFile(file, fileName);
            });

            const uploadResults = await Promise.all(uploadPromises);

            await this.usageService.updateUserStorageUsage(userId, inComingUsage);

            return uploadResults;
        }

        const fileName = `${userId}/${files.originalname}`;
        const uploadResult = await this.storageConfig.uploadFile(files, fileName);

        await this.usageService.updateUserStorageUsage(userId);

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

    delete = async (userId: string, fileIds: string[]) => {
        const deleteResult = this.storageConfig.deleteFiles(fileIds);

        return deleteResult;
    };
}
