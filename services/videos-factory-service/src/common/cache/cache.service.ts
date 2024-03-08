import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { createHash } from "crypto";
import { Response } from "express";

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get<TValue>(key: string): Promise<TValue> {
        return this.cacheManager.get(key);
    }

    async set<TValue>(key: string, value: TValue, httpResponse?: Response, ttl?: number) {
        const lastModified = new Date().toUTCString();
        const etag = createHash("sha1").update(JSON.stringify(value)).digest("hex");

        httpResponse.setHeader("X-Cache", "MISS");
        httpResponse.setHeader("Cache-Control", "no-cache");
        httpResponse?.setHeader("ETag", etag);
        httpResponse?.setHeader("Last-Modified", lastModified);
        await this.cacheManager.set(key, { data: value, lastModified, etag }, ttl);
    }

    async invalidate(key: string, data: any, httpResponse?: Response) {
        await this.cacheManager.del(key);

        const newEtag = createHash("sha1").update(JSON.stringify(data)).digest("hex");
        const lastModified = new Date().toUTCString();

        httpResponse?.setHeader("Cache-Control", "no-cache");
        httpResponse?.setHeader("ETag", newEtag);
        httpResponse?.setHeader("Last-Modified", lastModified);
    }
}
