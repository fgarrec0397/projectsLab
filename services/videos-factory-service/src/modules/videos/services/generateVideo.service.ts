import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { Script } from "../components/ScriptManager/ScriptManager";
import { Template } from "../videosTypes";
import { ScriptService } from "./videoGenerator/script.service";
import { TemplateService } from "./videoGenerator/template.service";
import { VideoRendererService } from "./videoGenerator/videoRenderer.service";

const canGenerateScript = true;
const canGenerateTemplate = true;
const canRenderVideo = true;

@Injectable()
export class VideoGeneratorService {
    constructor(
        private readonly scriptService: ScriptService,
        private readonly templateService: TemplateService,
        private readonly videoService: VideoRendererService
    ) {}

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
