import { Controller, Post } from "@nestjs/common";

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
        private readonly scriptService: ScriptService,
        private readonly templateService: TemplateService,
        private readonly videoService: VideoService
    ) {}

    @Post()
    async createVideo() {
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
                result.status(200).json({ result: "Video not created" });
                return;
            }

            if (template) {
                await this.videoService.generateVideo(template);
            }

            result.status(200).json({ result: "Video created" });
        } catch (error) {
            console.log(error, "error");

            result.status(500).json({ error });
        }

        return "create a video";
    }
}
