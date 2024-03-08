import { Request } from "express";

export const getAuthCacheKey = (cacheKey: string) => (request: Request) => {
    return createAuthCacheKey(cacheKey, request.userId);
};

export const createAuthCacheKey = (cacheKey: string, userId: string) => `${cacheKey}-${userId}`;
