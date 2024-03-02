import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { getAuthCacheKey } from "src/common/cache/cache.utils";
import { UseCache } from "src/common/cache/decorators/use-cache.decorator";
import { UseInvalidateCache } from "src/common/cache/decorators/use-invalidate-cache.decorator";
import { MONTH_IN_SECONDS } from "src/common/constants";

import { VideosService } from "./services/videos.service";
import { IVideo, IVideoDraft } from "./videos.types";

const videosCacheKey = getAuthCacheKey("videos");

@Controller("videos")
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Get()
    @UseCache(videosCacheKey, MONTH_IN_SECONDS)
    async getVideos(@Req() request: Request) {
        return this.videosService.getVideos(request.userId);
    }

    @Post("startRendering")
    @UseInvalidateCache(videosCacheKey)
    async renderVideo(@Req() request: Request, @Body() video: IVideo) {
        return this.videosService.startRendering(request.userId, video);
    }

    @Delete("/:id")
    @UseInvalidateCache(videosCacheKey)
    async deleteVideo(@Req() request: Request, @Param("id") id: string) {
        return this.videosService.deleteVideo(request.userId, id);
    }

    @Get("draft/getLast")
    @UseInvalidateCache(videosCacheKey)
    async getLastOrDefaultVideoDraft(@Req() request: Request) {
        return this.videosService.getLastOrDefaultVideoDraft(request.userId);
    }

    @Patch("draft/save")
    @UseInvalidateCache(videosCacheKey)
    async saveDraft(@Req() request: Request, @Body() videoDraft: IVideoDraft) {
        return this.videosService.saveLastVideoDraft(request.userId, videoDraft);
    }
}
