import { Body, Controller, Get, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { Public } from "../auth/decorators/use-public.guard";
import { VideoGeneratorService } from "./services/generateVideo.service";
import { VideosService } from "./services/videos.service";
import { IVideoDraft } from "./videosTypes";

@Controller("videos")
export class VideoController {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        private readonly videoGeneratorService: VideoGeneratorService,
        private readonly videosService: VideosService
    ) {}

    @Get()
    @Public()
    async getVideo() {
        return "not authenticated route";
    }

    @Post()
    async createVideo(@Req() request: Request) {
        console.log("createVideo");

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

        // this.database.set();

        return { result: "video created" };
    }

    @Post("render/:id")
    async renderVideo() {
        this.videoGeneratorService.renderVideo();
    }

    @Get("draft/getOrCreate")
    async getOrCreateVideoDraft(@Req() request: Request) {
        return this.videosService.getOrCreateLastVideoDraft(request.userId);
    }

    @Patch("draft/save")
    async saveDraft(@Req() request: Request, @Body() videoDraft: IVideoDraft) {
        console.log(videoDraft, "saveDraft in controller");

        return this.videosService.saveLastVideoDraft(request.userId, videoDraft);
    }
}
