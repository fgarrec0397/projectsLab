import { Inject, Injectable } from "@nestjs/common";

export type StorageManagerTypes = {
    getFile: unknown;
    getFiles: unknown[];
    uploadFile: unknown;
    renameFile: unknown;
    renameFolder: unknown;
    createFolder: unknown;
    downloadFile: unknown;
    deleteFiles: unknown;
};

export interface StorageStrategy<T extends StorageManagerTypes> {
    init(): void;
    getBaseUrl(): string;
    getFileName(fileId: string): string;
    getFileExtension(fileId: string): string;
    getFileUrl(fileId: string): string;
    getFile(id: string): Promise<T["getFile"]>;
    getFiles(path: string): Promise<T["getFiles"]>;
    uploadFile(file: Express.Multer.File, name: string): Promise<T["uploadFile"]>;
    renameFile(fileName: string, newFileName: string): Promise<T["renameFile"]>;
    renameFolder(folderName: string, newFolderName: string): Promise<T["renameFolder"]>;
    createFolder(folderName: string): Promise<T["createFolder"]>;
    downloadFile(fileName: string, destinationPath: string): Promise<T["downloadFile"]>;
    deleteFiles(fileIds: string[]): Promise<T["deleteFiles"]>;
}

export const STORAGE_MANAGER_TOKEN = "StorageManagerToken";

@Injectable()
export class StorageManager<T extends StorageManagerTypes> {
    constructor(
        @Inject(STORAGE_MANAGER_TOKEN) private readonly storageStrategy: StorageStrategy<T>
    ) {
        this.init();
    }

    init() {
        this.storageStrategy.init();
    }

    getBaseUrl() {
        return this.storageStrategy.getBaseUrl();
    }

    getFileName(fileId: string | undefined) {
        return this.storageStrategy.getFileName(fileId);
    }

    getFileExtension(fileId: string | undefined) {
        return this.storageStrategy.getFileExtension(fileId);
    }

    getFileUrl(fileId: string | undefined) {
        return this.storageStrategy.getFileUrl(fileId);
    }

    async getFile(id?: string): Promise<T["getFile"]> {
        return this.storageStrategy.getFiles(id);
    }

    async getFiles(path?: string): Promise<T["getFiles"]> {
        return this.storageStrategy.getFiles(path);
    }

    async uploadFile(file: Express.Multer.File, name: string) {
        return this.storageStrategy.uploadFile(file, name);
    }

    async renameFile(fileName: string, newFileName: string) {
        return this.storageStrategy.renameFile(fileName, newFileName);
    }

    async renameFolder(folderName: string, newFolderName: string) {
        return this.storageStrategy.renameFile(folderName, newFolderName);
    }

    async createFolder(folderName: string) {
        return this.storageStrategy.createFolder(folderName);
    }

    async downloadFile(fileName: string, destinationPath: string) {
        return this.storageStrategy.downloadFile(fileName, destinationPath);
    }

    async deleteFiles(fileIds: string[]) {
        return this.storageStrategy.deleteFiles(fileIds);
    }
}

export default StorageManager;
