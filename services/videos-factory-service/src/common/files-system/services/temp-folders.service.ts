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
    finalVoiceGenerationFolder = "final-voice-generation";

    tempVoiceGenerationFolder = "temp-voice-generation";

    subtitlesFolder = "subtitles";

    thumbnailFolder = "thumbnails";

    videoRenderingFolder = "video-rendering";

    filesUploadProcessingFolder = "files-upload-processing";

    expirationTime = HOUR_IN_SECONDS * 1000;

    tempFolder = this.fileSystem.getAssetsPath("temp");

    constructor(private readonly fileSystem: FileSystemService) {}

    getTempFolderPath(subFolder: string, key?: string): TempFolder {
        const date = new Date();
        const keyId = key ? key : uidGenerator();
        const id = `${keyId}-${date.getTime()}`;

        let tempFolderPath = path.join(this.tempFolder, subFolder);

        if (id) {
            tempFolderPath = path.join(tempFolderPath, id);
        }

        const cleanUp = () => this.fileSystem.removeFile(tempFolderPath);

        return { tempFolderPath, cleanUp };
    }

    async getTempFolders(name: string) {
        return this.fileSystem.getFolders(this.fileSystem.getAssetsPath(`temp/${name}`));
    }

    async cleanUserTempFolders(subFolderName: string, userId: string) {
        const folders = await this.getTempFolders(subFolderName);

        for (const folder of folders) {
            const [id, timestamp] = folder.name.split("-");

            if (id === userId) {
                const now = Date.now();
                const expiredTime = now - this.expirationTime;
                const isExpired = Number(timestamp) < expiredTime;

                if (isExpired) {
                    await this.fileSystem.removeFile(path.join(folder.path, folder.name));
                }
            }
        }
    }

    async cleanUpAll() {
        this.fileSystem.removeFile(this.tempFolder);
    }
}
