import { Controller, Post } from "@nestjs/common";

import { ScriptService } from "./services/script.service";
import { TemplateService } from "./services/template.service";
import { VideoService } from "./services/video.service";

@Controller("video")
export class VideoController {
    constructor(
        private readonly scriptService: ScriptService,
        private readonly templateService: TemplateService,
        private readonly videoService: VideoService
    ) {}

    @Post()
    async createVideo() {
        console.log("create a video");

        return "create a video";
    }
}
