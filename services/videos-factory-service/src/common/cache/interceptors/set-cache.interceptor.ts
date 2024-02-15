import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { CacheService } from "../cache.service";

export type CacheKey = string | ((context: Request) => string);

@Injectable()
export class SetCacheInterceptor implements NestInterceptor {
    constructor(
        private cacheService: CacheService,
        private reflector: Reflector
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const { key, ttl } = this.getMetaData(context);

        if (!key) return next.handle();

        const cachedResponse = await this.cacheService.get(key);

        if (cachedResponse) return of(cachedResponse);

        return next.handle().pipe(tap((response) => this.cacheService.set(key, response, ttl)));
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
