import { Injectable } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import * as path from "path";
import { HOUR_IN_SECONDS } from "src/common/constants";

import { FileSystemService } from "./file-system.service";

export type TempFolder = {
    tempFolderPath: string;
    cleanUp: () => Promise<void>;
};

@Injectable()
export class TempFoldersService {
    tempFolder = this.fileSystem.getAssetsPath("temp");

    constructor(private readonly fileSystem: FileSystemService) {}

    getTempFolderPath(subFolder: string, key?: string): TempFolder {
        const date = new Date();
        const keyId = key ? key : uidGenerator();
        const id = `${keyId}-${date.getTime()}`;

        let tempFolderPath = path.join(this.tempFolder, subFolder);

        if (id) {
            tempFolderPath = path.join(this.tempFolder, id);
        }

        const cleanUp = () => this.fileSystem.removeFile(tempFolderPath);

        return { tempFolderPath, cleanUp };
    }

    async getTempFolders(name: string) {
        return this.fileSystem.getFolders(this.fileSystem.getAssetsPath(`temp/${name}`));
    }

    async cleanUpByUser(subFolderName: string, userId: string) {
        const folders = await this.getTempFolders(subFolderName);

        for (const folder of folders) {
            const [id, timestamp] = folder.name.split("-");

            if (id === userId) {
                const now = Date.now();
                const oneHourAgo = now - HOUR_IN_SECONDS * 1000;
                const isOlderThanOneHour = Number(timestamp) < oneHourAgo;

                if (isOlderThanOneHour) {
                    await this.fileSystem.removeFile(path.join(folder.path, folder.name));
                }
            }
        }
    }

    async cleanUpAll() {
        this.fileSystem.removeFile(this.tempFolder);
    }
}
