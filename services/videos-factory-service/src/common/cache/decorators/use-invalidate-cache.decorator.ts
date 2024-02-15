import { applyDecorators, UseInterceptors } from "@nestjs/common";

import { InvalidateCacheInterceptor } from "../interceptors/invalidate-cache.interceptor";
import { CacheKey } from "../interceptors/set-cache.interceptor";
import { InvalidateCache } from "./invalidate-cache.decorator";

export function UseInvalidateCache(key: CacheKey) {
    return applyDecorators(UseInterceptors(InvalidateCacheInterceptor), InvalidateCache(key));
}
