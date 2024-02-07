import { Module } from "@nestjs/common";
import S3StorageManager from "src/common/storage/strategies/s3-storage-manager";

import { FilesController } from "./files.controller";
import { FilesMapper } from "./files.mapper";
import { FilesService } from "./files.service";

@Module({
    providers: [FilesService, S3StorageManager, FilesMapper],
    controllers: [FilesController],
})
export class FilesModule {}
