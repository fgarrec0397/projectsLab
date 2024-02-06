import { Module } from "@nestjs/common";
import S3StorageManager from "src/common/services/s3-storage-manager.service";

import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
    providers: [S3StorageManager, FilesService],
    controllers: [FilesController],
})
export class FilesModule {}
