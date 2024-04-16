import { Module } from "@nestjs/common";
import S3StorageManager from "src/common/storage/strategies/s3-storage-manager";

import { UsageModule } from "../usage/usage.module";
import { FilesController } from "./files.controller";
import { FilesMapper } from "./mappers/files.mapper";
import { FilesService } from "./services/files.service";

@Module({
    imports: [UsageModule],
    providers: [FilesService, S3StorageManager, FilesMapper],
    controllers: [FilesController],
})
export class FilesModule {}
