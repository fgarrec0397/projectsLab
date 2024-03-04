import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { FileSystem } from "src/common/FileSystem";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { VideoUtils } from "../../video-processing/submodules/video-renderer/video.utils";

@Injectable()
export class AfterFilesUploadInterceptor implements NestInterceptor {
    constructor(@InjectStorageConfig() private readonly storageConfig: StorageConfig) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap((data) => {
                if (!data.uploadedFilesIds) {
                    return of(data);
                }

                this.processFilesInBackground(data.uploadedFilesIds)
                    .then(() => {
                        console.log("Files upload processing completed");
                    })
                    .catch((error) => {
                        console.error("Files upload processing failed", error);
                    });

                return of(data);
            })
        );
    }

    private async processFilesInBackground(fileIds: string[]): Promise<void> {
        const { tempFolderPath, cleanUp } =
            await FileSystem.getTempFolderPath("files-upload-processing");

        await FileSystem.createDirectory(tempFolderPath);

        try {
            for (const fileId of fileIds) {
                const date = new Date();
                const { tempFolderPath: tempFileFolder } = await FileSystem.getTempFolderPath(
                    "files-upload-processing",
                    `${date.getTime()}-${uidGenerator()}`
                );

                const inputFilePath = await this.storageConfig.downloadFile(fileId, tempFileFolder);

                const hasFileAudio = await VideoUtils.hasAudioStream(inputFilePath);

                if (!hasFileAudio) {
                    const tempFolderOutput = `${tempFileFolder}/output`;
                    const outputFilePath = `${tempFolderOutput}/${this.storageConfig.getFileName(
                        fileId
                    )}`;

                    await FileSystem.createDirectory(tempFolderOutput);
                    await VideoUtils.addSilentAudioToVideo(inputFilePath, outputFilePath);
                    await this.storageConfig.uploadFile(outputFilePath, fileId);
                }
            }

            await cleanUp();
        } catch (error) {
            console.error("Error processing files in background", error);
        }
    }
}
