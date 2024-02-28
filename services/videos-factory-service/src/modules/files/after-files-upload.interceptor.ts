import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FileSystem } from "src/common/FileSystem";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { VideoUtils } from "../video-processing/submodules/video-renderer/video.utils";

@Injectable()
export class AfterFilesUploadInterceptor implements NestInterceptor {
    constructor(@InjectStorageConfig() private readonly storageConfig: StorageConfig) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(async (data) => {
                if (!data.uploadedFilesIds) {
                    return data;
                }

                const tempFolder = FileSystem.getTempFolderPath();

                await FileSystem.createDirectory(tempFolder);

                try {
                    for (const fileId of data.uploadedFilesIds) {
                        const date = new Date();
                        const tempFileFolder = FileSystem.getTempFolderPath(
                            `${date.getTime()}-${uidGenerator()}`
                        );

                        await FileSystem.createDirectory(tempFileFolder);

                        const inputFilePath = await this.storageConfig.downloadFile(
                            fileId,
                            tempFileFolder
                        );

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

                    await FileSystem.removeFile(tempFolder);
                } catch (error) {
                    console.log(error);
                }
            })
        );
    }
}
