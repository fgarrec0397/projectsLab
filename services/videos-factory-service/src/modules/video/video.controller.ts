import { Controller, Get, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { Database } from "src/common/database/database";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { Public } from "../auth/decorators/use-public.guard";
import { Script } from "./components/ScriptManager/ScriptManager";
import { ScriptService } from "./services/script.service";
import { TemplateService } from "./services/template.service";
import { VideoService } from "./services/video.service";
import { Template } from "./videoTypes";

const canGenerateScript = true;
const canGenerateTemplate = true;
const canRenderVideo = true;

@Controller("video")
export class VideoController {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        private readonly scriptService: ScriptService,
        private readonly templateService: TemplateService,
        private readonly videoService: VideoService
    ) {}

    @Get()
    @Public()
    async getVideo() {
        return "not authenticated route";
    }

    @Get()
    async getOrCreateVideoDraft(@Req() request: Request) {
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
        let script: Script = {};
        let template: Template | undefined = undefined;

        if (canGenerateScript) {
            script = await this.scriptService.generateScript();
        }

        if (canGenerateTemplate) {
            this.templateService.prepareTemplate(script);
            template = await this.templateService.createTemplate();
        }

        try {
            if (!canRenderVideo) {
                return { result: "Video not created" };
            }

            if (template) {
                await this.videoService.generateVideo(template);
            }

            return { result: "Video created" };
        } catch (error) {
            throw new HttpException(error as Record<string, any>, HttpStatus.BAD_REQUEST);
        }
    }
}
