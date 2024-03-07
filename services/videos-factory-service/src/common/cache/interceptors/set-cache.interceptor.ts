import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { createHash } from "crypto";
import { Request, Response } from "express";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { CacheService } from "../cache.service";

export type CacheKey = string | ((context: Request) => string);

type CacheResponse = { data: any; lastModified: string; etag: string };

@Injectable()
export class SetCacheInterceptor implements NestInterceptor {
    constructor(
        private cacheService: CacheService,
        private reflector: Reflector
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const { key, ttl } = this.getMetaData(context);

        if (!key) return next.handle();

        const cachedResponse = await this.cacheService.get<CacheResponse>(key);

        const httpResponse: Response = context.switchToHttp().getResponse();

        if (cachedResponse) {
            httpResponse.setHeader("X-Cache", "HIT");
            httpResponse.setHeader("Cache-Control", "max-age=120"); // Example: cache is fresh for 120 seconds
            httpResponse.setHeader("ETag", cachedResponse.etag); // Assuming your cache stores ETags
            httpResponse.setHeader("Last-Modified", cachedResponse.lastModified);
            return of(cachedResponse.data);
        } else {
            return next.handle().pipe(
                tap((response) => {
                    const lastModified = new Date().toUTCString();
                    const etag = createHash("sha1").update(JSON.stringify(response)).digest("hex");

                    httpResponse.setHeader("X-Cache", "MISS");

                    this.cacheService.set<CacheResponse>(
                        key,
                        { data: response, lastModified, etag },
                        ttl
                    );
                })
            );
        }
    }

    private getMetaData(context: ExecutionContext): {
        key: string;
        ttl?: number;
    } {
        const method = context.getHandler();
        const request = context.switchToHttp().getRequest();

        const { key, ttl } =
            this.reflector.get<{ key: CacheKey; ttl?: number }>("setCache", method) || {};

        const resolvedKey = typeof key === "function" ? key(request) : key;

        return {
            key: resolvedKey,
            ttl,
        };
    }
}
