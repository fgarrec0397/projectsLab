import { CacheModule as CacheManagerModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    imports: [
        CacheManagerModule.register({
            ttl: 5,
            max: 100,
        }),
    ],
    exports: [CacheManagerModule],
})
export class CacheModule {}
