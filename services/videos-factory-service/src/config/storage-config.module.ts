import { Global, Inject, Module } from "@nestjs/common";
import StorageManager, { STORAGE_MANAGER_TOKEN } from "src/common/storage/storage-manager";
import S3StorageManager from "src/common/storage/strategies/s3-storage-manager";

const provider = {
    provide: STORAGE_MANAGER_TOKEN,
    useClass: S3StorageManager,
};

export type StorageConfig = S3StorageManager;

export const InjectStorageConfig = () => Inject(STORAGE_MANAGER_TOKEN);

@Global()
@Module({
    providers: [provider, StorageManager],
    exports: [provider, StorageManager],
})
export class StorageConfigModule {}
