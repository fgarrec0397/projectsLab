import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { UseCache } from "src/common/cache/decorators/use-cache.decorator";
import { UseInvalidateCache } from "src/common/cache/decorators/use-invalidate-cache.decorator";

import { VideosService } from "./services/videos.service";
import { useVideoByIdCacheKey, useVideosCacheKey } from "./utils/videos.utils";
import { VIDEOS_CACHE_DURATION } from "./videos.constants";
import { IVideo, IVideoDraft } from "./videos.types";

@Controller("videos")
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Get()
    @UseCache(useVideosCacheKey, VIDEOS_CACHE_DURATION)
    async getVideos(@Req() request: Request, @Query("withThumbnails") withThumbnails: boolean) {
        return this.videosService.getVideos(request.userId, withThumbnails);
    }

    @Get("/:videoId")
    @UseCache(useVideoByIdCacheKey, VIDEOS_CACHE_DURATION)
    async getVideoById(@Req() request: Request, @Param("videoId") videoId: string) {
        return this.videosService.getVideoById(request.userId, videoId);
    }

    @Get("/videoUrl/:videoId")
    async getVideoUrlById(@Req() request: Request, @Param("videoId") videoId: string) {
        return this.videosService.getVideoUrlById(request.userId, videoId);
    }

    @Post("startRendering")
    @UseInvalidateCache(useVideosCacheKey)
    async renderVideo(@Req() request: Request, @Body() video: IVideo) {
        return this.videosService.startRendering(request.userId, video);
    }

    @Delete("/:id")
    @UseInvalidateCache(useVideosCacheKey)
    @UseInvalidateCache(useVideoByIdCacheKey)
    async deleteVideo(@Req() request: Request, @Param("id") id: string) {
        return this.videosService.deleteVideo(request.userId, id);
    }

    @Get("draft/getLast")
    async getLastOrDefaultVideoDraft(@Req() request: Request) {
        return this.videosService.getLastOrDefaultVideoDraft(request.userId);
    }

    @Patch("draft/save")
    @UseInvalidateCache(useVideosCacheKey)
    async saveDraft(@Req() request: Request, @Body() videoDraft: IVideoDraft) {
        return this.videosService.saveLastVideoDraft(request.userId, videoDraft);
    }
}
