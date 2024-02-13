import { applyDecorators, UseInterceptors } from "@nestjs/common";

import { SetCacheInterceptor } from "../interceptors/set-cache.interceptor";
import { SetCache } from "./set-cache.decorator";

export function UseCache(key: string, ttl?: number) {
    return applyDecorators(UseInterceptors(SetCacheInterceptor), SetCache(key, ttl));
}
