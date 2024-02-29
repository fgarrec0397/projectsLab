import { Body, Controller, Get, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { getAuthCacheKey } from "src/common/cache/cache.utils";
import { UseCache } from "src/common/cache/decorators/use-cache.decorator";
import { UseInvalidateCache } from "src/common/cache/decorators/use-invalidate-cache.decorator";
import { MONTH_IN_SECONDS } from "src/common/constants";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { Public } from "../auth/decorators/use-public.guard";
import { VideosService } from "./services/videos.service";
import { IVideo, IVideoDraft } from "./videosTypes";

const videosCacheKey = getAuthCacheKey("videos");

@Controller("videos")
export class VideosController {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        private readonly videosService: VideosService
    ) {}

    @Get()
    @Public()
    async getVideo() {
        return "not authenticated route";
    }

    @Post()
    async createVideo(@Req() request: Request) {
        const userRef = this.database.getDB().collection("users").doc(request.userId);
        const videosRef = userRef.collection("videos");
        const videoData = {
            title: "My First Video",
            description: "This is a description of my first video.",
            uploaded: new Date(),
        };

        await videosRef
            .add(videoData)
            .then((docRef) => console.log("Video added with ID: ", docRef.id))
            .catch((error) => console.error("Error adding video: ", error));

        return { result: "video created" };
    }

    @Post("startRendering")
    async renderVideo(@Req() request: Request, @Body() video: IVideo) {
        return this.videosService.startRendering(request.userId, video);
    }

    @Get("draft/getOrCreate")
    @UseCache(videosCacheKey, MONTH_IN_SECONDS)
    async getOrCreateVideoDraft(@Req() request: Request) {
        return this.videosService.getOrCreateLastVideoDraft(request.userId);
    }

    @Patch("draft/save")
    @UseInvalidateCache(videosCacheKey)
    async saveDraft(@Req() request: Request, @Body() videoDraft: IVideoDraft) {
        return this.videosService.saveLastVideoDraft(request.userId, videoDraft);
    }
}
