import { promises, readFile, readFileSync } from "fs";
import path from "path";

export class FileSystem {
    static getAssetsPath(assetPath: string) {
        return FileSystem.getPath("./assets/poc", assetPath); // TODO - config - "./assets/poc"
    }

    static getPath(...filePath: string[]) {
        return path.resolve(...filePath);
    }

    static async ensureDirectoryExists(filePath: string): Promise<void> {
        const directoryPath = path.dirname(filePath);

        if (!(await FileSystem.fileExists(directoryPath))) {
            await FileSystem.createDirectory(directoryPath);
        }
    }

    static async fileExists(filePath: string): Promise<boolean> {
        try {
            await promises.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    static async createDirectory(directoryPath: string): Promise<void> {
        await promises.mkdir(directoryPath, { recursive: true });
    }

    static async createFileWithDirectories(filePath: string, data: string | Buffer): Promise<void> {
        await FileSystem.ensureDirectoryExists(filePath);
        await promises.writeFile(filePath, data);
    }

    static convertFileToBuffer(filePath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log("convertMp3ToBuffer finished");

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
