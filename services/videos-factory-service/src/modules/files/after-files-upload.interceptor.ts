import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { InjectStorageConfig, StorageConfig } from "src/config/storage-config.module";

import { VideoUtils } from "../video-processing/submodules/video-renderer/video.utils";

@Injectable()
export class AfterFilesUploadInterceptor implements NestInterceptor {
    constructor(@InjectStorageConfig() private readonly storageConfig: StorageConfig) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(async (data) => {
                console.log(data, "data AfterFilesUploadInterceptor");
                // this.storageConfig.

                if (!data.uploadedFilesIds) {
                    return data;
                }

                try {
                    for (const fileId of data.uploadedFilesIds) {
                        const inputURL = this.storageConfig.getFileUrl(fileId);
                        const outputURL = this.storageConfig.getFileUrl(fileId, "putObject");

                        const hasFileAudio = await VideoUtils.hasAudioStream(inputURL);
                        console.log({ hasFileAudio, fileId });

                        if (!hasFileAudio) {
                            await VideoUtils.addSilentAudioToVideo(inputURL, outputURL);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }),
            tap((data) => {
                const request = context.switchToHttp().getRequest();
                const files = request.body;

                console.log(data, "data tap AfterFilesUploadInterceptor");

                // After controller logic goes here
                // This code is executed after the controller's request handler has finished
            })
        );
    }
}
