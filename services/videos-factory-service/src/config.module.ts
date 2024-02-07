import { Module } from "@nestjs/common";

import { StorageConfigModule } from "./config/storage-config.module";

@Module({
    imports: [StorageConfigModule],
})
export class ConfigModule {}
