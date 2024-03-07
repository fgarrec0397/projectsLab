import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { createHash } from "crypto";
import { Response } from "express";
import { tap } from "rxjs/operators";

import { CacheService } from "../cache.service";
import { CacheKey } from "./set-cache.interceptor";

@Injectable()
export class InvalidateCacheInterceptor implements NestInterceptor {
    constructor(
        private cacheService: CacheService,
        private reflector: Reflector
    ) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        const method = context.getHandler();
        const request = context.switchToHttp().getRequest();
        const key = this.reflector.get<CacheKey>("invalidateCache", method);

        const resolvedKey = typeof key === "function" ? key(request) : key;
        const httpResponse: Response = context.switchToHttp().getResponse();

        if (!resolvedKey) return next.handle();

        return next.handle().pipe(
            tap((data) => {
                this.cacheService.invalidate(resolvedKey).then(() => {
                    const newEtag = createHash("sha1").update(JSON.stringify(data)).digest("hex");
                    const lastModified = new Date().toUTCString();

                    httpResponse.setHeader("Cache-Control", "no-cache");
                    httpResponse.setHeader("ETag", newEtag);
                    httpResponse.setHeader("Last-Modified", lastModified);
                });
            })
        );
    }
}
