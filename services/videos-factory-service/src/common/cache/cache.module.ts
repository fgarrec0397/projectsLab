import { CacheModule as CacheManagerModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";

import { CacheService } from "./cache.service";

@Global()
@Module({
    imports: [
        CacheManagerModule.register({
            ttl: 5,
            max: 100,
        }),
    ],
    providers: [CacheService],
    exports: [CacheManagerModule, CacheService],
})
export class CacheModule {}
