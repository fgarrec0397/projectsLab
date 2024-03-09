import { Request } from "express";

export const useAuthCacheKey = (cacheKey: string) => (request: Request) => {
    return getUserCacheKey(cacheKey, request.userId);
};

export const getUserCacheKey = (cacheKey: string, userId: string) => `${cacheKey}-${userId}`;
