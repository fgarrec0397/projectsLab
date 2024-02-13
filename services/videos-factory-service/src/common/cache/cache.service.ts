import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get<TValue>(key: string): Promise<TValue> {
        return this.cacheManager.get(key);
    }

    async set<TValue>(key: string, value: TValue, ttl?: number) {
        await this.cacheManager.set(key, value, ttl);
    }

    async invalidate(key: string) {
        await this.cacheManager.del(key);
    }
}
