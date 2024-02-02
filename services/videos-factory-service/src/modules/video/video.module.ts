import { Module } from "@nestjs/common";

import { ScriptService } from "./services/script.service";
import { TemplateService } from "./services/template.service";
import { VideoService } from "./services/video.service";
import { VideoController } from "./video.controller";

@Module({
    providers: [VideoService, ScriptService, TemplateService],
    controllers: [VideoController],
})
export class VideoModule {}
