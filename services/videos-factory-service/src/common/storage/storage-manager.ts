import { Inject, Injectable } from "@nestjs/common";

export type StorageManagerTypes = {
    getFiles: unknown[];
    uploadFile: unknown;
    downloadFile: unknown;
};

export interface StorageStrategy<T extends StorageManagerTypes> {
    init(): void;
    getBaseUrl(): string;
    getFileName(fileId: string): string;
    getFileExtension(fileId: string): string;
    getFileUrl(fileId: string): string;
    getFiles(path: string): Promise<T["getFiles"]>;
    uploadFile(fileName: string, destinationPath: string): Promise<T["uploadFile"]>;
    downloadFile(fileName: string, destinationPath: string): Promise<T["downloadFile"]>;
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

    async getFiles(path?: string): Promise<T["getFiles"]> {
        return this.storageStrategy.getFiles(path);
    }

    async uploadFile(fileName: string, destinationPath: string) {
        return this.storageStrategy.uploadFile(fileName, destinationPath);
    }

    async downloadFile(fileName: string, destinationPath: string) {
        return this.storageStrategy.downloadFile(fileName, destinationPath);
    }
}

export default StorageManager;
