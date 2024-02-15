import { SetMetadata } from "@nestjs/common";

import { CacheKey } from "../interceptors/set-cache.interceptor";

export const SetCache = (key: CacheKey, ttl?: number) => SetMetadata("setCache", { key, ttl });
