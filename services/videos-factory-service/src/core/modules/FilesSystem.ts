import { readFile, readFileSync } from "fs";
import path from "path";

export class FilesSystem {
    static getAssetsPath(assetPath: string) {
        return path.resolve("./assets/poc", assetPath);
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
