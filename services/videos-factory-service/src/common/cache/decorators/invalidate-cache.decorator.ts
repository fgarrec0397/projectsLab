import { SetMetadata } from "@nestjs/common";

export const InvalidateCache = (key: string) => SetMetadata("invalidateCache", key);
