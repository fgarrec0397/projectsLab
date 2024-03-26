import { Injectable } from "@nestjs/common";
import {
    createReadStream,
    createWriteStream,
    existsSync,
    promises,
    readFile,
    readFileSync,
    ReadStream,
    WriteStream,
} from "fs";
import path from "path";

@Injectable()
export class FileSystemService {
    getAssetsPath(assetPath?: string) {
        return this.getPath("./assets", assetPath || ""); // TODO - config - "./assets"
    }

    getPath(...filePath: string[]) {
        return path.resolve(...filePath);
    }

    async getFolders(directoryPath: string) {
        if (!this.isPathExistSync(directoryPath)) {
            return [];
        }

        try {
            const files = await promises.readdir(directoryPath, { withFileTypes: true });
            const directories = files.filter((x) => x.isDirectory());

            return directories || [];
        } catch (err) {
            console.error("Error reading the directory", err);

            return [];
        }
    }

    async ensureDirectoryExists(filePath: string): Promise<void> {
        const directoryPath = path.dirname(filePath);

        if (!(await this.isPathExist(directoryPath))) {
            await this.createDirectory(directoryPath);
        }
    }

    async isPathExist(filePath: string): Promise<boolean> {
        try {
            await promises.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    isPathExistSync(filePath: string) {
        return existsSync(filePath);
    }

    async removeFile(filePath: string): Promise<void> {
        if (!this.isPathExistSync(filePath)) {
            return;
        }

        await promises.rm(filePath, { recursive: true });
    }

    async createDirectory(directoryPath: string): Promise<void> {
        await promises.mkdir(directoryPath, { recursive: true });
    }

    async createFile(filePath: string, data?: string | Buffer): Promise<void> {
        await this.ensureDirectoryExists(filePath);
        await promises.writeFile(filePath, data || "");
    }

    async createReadStream(filePath: string): Promise<ReadStream> {
        return createReadStream(filePath);
    }

    createWriteStream(filePath: string): WriteStream {
        return createWriteStream(filePath);
    }

    convertFileToBuffer(filePath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(data);
            });
        });
    }

    loadJson<TValue>(jsonPath: string) {
        try {
            const rawData = readFileSync(jsonPath, "utf8");

            const jsonObject = JSON.parse(rawData);

            return jsonObject as TValue;
        } catch (error) {
            console.error("Error reading the file:", error);
            return null;
        }
    }
}
