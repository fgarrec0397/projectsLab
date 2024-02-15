import { SetMetadata } from "@nestjs/common";

import { CacheKey } from "../interceptors/set-cache.interceptor";

export const InvalidateCache = (key: CacheKey) => SetMetadata("invalidateCache", key);
