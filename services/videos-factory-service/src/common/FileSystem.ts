import { uidGenerator } from "@projectslab/helpers";
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

export type TempFolder = {
    tempFolderPath: string;
    cleanUp: () => Promise<void>;
};

export class FileSystem {
    static getAssetsPath(assetPath?: string) {
        return FileSystem.getPath("./assets/poc", assetPath || ""); // TODO - config - "./assets/poc"
    }

    static getTempFolderPath(subFolder: string, key?: string): TempFolder {
        const date = new Date();
        const keyId = key ? key : uidGenerator();
        const id = `${keyId}-${date.getTime()}`;

        let folderPath = `temp/${subFolder}`;

        if (id) {
            folderPath += `/${id}`;
        }

        const tempFolderPath = FileSystem.getAssetsPath(folderPath);

        const cleanUp = () => FileSystem.removeFile(tempFolderPath);

        return { tempFolderPath, cleanUp };
    }

    static getPath(...filePath: string[]) {
        return path.resolve(...filePath);
    }

    static async getFolders(directoryPath: string) {
        if (!FileSystem.isPathExistSync(directoryPath)) {
            return [];
        }

        try {
            const files = await promises.readdir(directoryPath, { withFileTypes: true });
            const directories = files.filter((x) => x.isDirectory());

            console.log("Folders:", directories);

            return directories || [];
        } catch (err) {
            return [];
        }
    }

    static async ensureDirectoryExists(filePath: string): Promise<void> {
        const directoryPath = path.dirname(filePath);

        if (!(await FileSystem.isPathExist(directoryPath))) {
            await FileSystem.createDirectory(directoryPath);
        }
    }

    static async isPathExist(filePath: string): Promise<boolean> {
        try {
            await promises.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    static isPathExistSync(filePath: string) {
        return existsSync(filePath);
    }

    static async removeFile(filePath: string): Promise<void> {
        if (!FileSystem.isPathExistSync(filePath)) {
            return;
        }

        await promises.rm(filePath, { recursive: true });
    }

    static async createDirectory(directoryPath: string): Promise<void> {
        await promises.mkdir(directoryPath, { recursive: true });
    }

    static async createFile(filePath: string, data?: string | Buffer): Promise<void> {
        await FileSystem.ensureDirectoryExists(filePath);
        await promises.writeFile(filePath, data || "");
    }

    static async createReadStream(filePath: string): Promise<ReadStream> {
        return createReadStream(filePath);
    }

    static createWriteStream(filePath: string): WriteStream {
        return createWriteStream(filePath);
    }

    static convertFileToBuffer(filePath: string): Promise<Buffer> {
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

    static loadJson<TValue>(jsonPath: string) {
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
