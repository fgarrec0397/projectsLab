import { Request } from "express";
import { getUserCacheKey, useAuthCacheKey } from "src/common/cache/cache.utils";

export const useVideosCacheKey = useAuthCacheKey("videos");

export const getVideosCacheKey = (userId: string) => getUserCacheKey("videos", userId);

export const useVideoByIdCacheKey = (request: Request) => getVideoByIdCacheKey(request.videoId);

export const getVideoByIdCacheKey = (videoId: string) => `videoById-${videoId}`;
