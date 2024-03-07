import { Request } from "express";

export const getAuthCacheKey = (cacheKey: string) => (request: Request) =>
    `${cacheKey}-${request.userId}`;
