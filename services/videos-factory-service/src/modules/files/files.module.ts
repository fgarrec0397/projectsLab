import { Module } from "@nestjs/common";
import S3StorageManager from "src/common/storage/strategies/s3-storage-manager";

import { FilesController } from "./files.controller";
import { FilesMapper } from "./mappers/files.mapper";
import { FilesService } from "./services/files.service";

@Module({
    providers: [FilesService, S3StorageManager, FilesMapper],
    controllers: [FilesController],
})
export class FilesModule {}
