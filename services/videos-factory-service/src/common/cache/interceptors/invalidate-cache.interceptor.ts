import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
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
            tap(async (data) => {
                await this.cacheService.invalidate(resolvedKey, data, httpResponse);
            })
        );
    }
}
