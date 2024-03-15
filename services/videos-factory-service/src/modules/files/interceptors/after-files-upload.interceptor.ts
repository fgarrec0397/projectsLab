import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { FileSystemService } from "src/common/files-system/services/file-system.service";
import { TempFoldersService } from "src/common/files-system/services/temp-folders.service";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { VideoUtils } from "../../../common/utils/video.utils";

@Injectable()
export class AfterFilesUploadInterceptor implements NestInterceptor {
    constructor(
        @InjectStorageConfig() private readonly storageConfig: StorageConfig,
        private readonly tempFoldersService: TempFoldersService,
        private readonly fileSystem: FileSystemService
    ) {}

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
        try {
            for (const fileId of fileIds) {
                const filesUploadingFolder = this.tempFoldersService.getTempFolderPath(
                    this.tempFoldersService.filesUploadProcessingFolder
                );

                await this.fileSystem.createDirectory(filesUploadingFolder.tempFolderPath);

                const inputFilePath = await this.storageConfig.downloadFile(
                    fileId,
                    filesUploadingFolder.tempFolderPath
                );

                const hasFileAudio = await VideoUtils.hasAudioStream(inputFilePath);

                if (!hasFileAudio) {
                    const tempFolderOutput = `${filesUploadingFolder.tempFolderPath}/output`;
                    const outputFilePath = `${tempFolderOutput}/${this.storageConfig.getFileName(
                        fileId
                    )}`;

                    await this.fileSystem.createDirectory(tempFolderOutput);
                    await VideoUtils.addSilentAudioToVideo(inputFilePath, outputFilePath);
                    await this.storageConfig.uploadFile(outputFilePath, fileId);
                }

                await filesUploadingFolder.cleanUp();
            }
        } catch (error) {
            console.error("Error processing files in background", error);
        }
    }
}
