import { applyDecorators, UseInterceptors } from "@nestjs/common";

import { CacheKey, SetCacheInterceptor } from "../interceptors/set-cache.interceptor";
import { SetCache } from "./set-cache.decorator";

export function UseCache(key: CacheKey, ttl?: number) {
    return applyDecorators(UseInterceptors(SetCacheInterceptor), SetCache(key, ttl));
}
