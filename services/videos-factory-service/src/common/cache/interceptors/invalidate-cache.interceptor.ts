import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { tap } from "rxjs/operators";

import { CacheService } from "../cache.service";

@Injectable()
export class InvalidateCacheInterceptor implements NestInterceptor {
    constructor(
        private cacheService: CacheService,
        private reflector: Reflector
    ) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        const method = context.getHandler();
        const key = this.reflector.get<string>("invalidateCache", method);

        if (!key) return next.handle();

        return next.handle().pipe(tap(async () => this.cacheService.invalidate(key)));
    }
}
