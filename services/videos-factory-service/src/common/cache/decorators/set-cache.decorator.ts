import { SetMetadata } from "@nestjs/common";

export const SetCache = (key: string, ttl?: number) => SetMetadata("setCache", { key, ttl });
