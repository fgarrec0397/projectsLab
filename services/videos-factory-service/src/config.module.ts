import { Module } from "@nestjs/common";

import { DatabaseConfigModule } from "./config/database-config.module";
import { StorageConfigModule } from "./config/storage-config.module";

@Module({
    imports: [StorageConfigModule, DatabaseConfigModule],
})
export class ConfigModule {}
