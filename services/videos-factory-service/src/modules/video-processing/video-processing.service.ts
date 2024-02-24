import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { Script, ScriptGeneratorService } from "../script-generator/script-generator.service";
import { TemplateGeneratorService } from "../template-generator/template-generator.service";
import { VideoRendererService } from "../video-renderer/video-renderer.service";
import { Template } from "../video-renderer/video-renderer.types";
import { IVideo } from "../videos/videosTypes";

const canGenerateScript = true;
const canGenerateTemplate = true;
const canRenderVideo = true;

@Injectable()
export class VideoProcessingService {
    constructor(
        private readonly scriptService: ScriptGeneratorService,
        private readonly templateService: TemplateGeneratorService,
        private readonly videoService: VideoRendererService
    ) {}

    async renderVideo(video: IVideo) {
        let script: Script = {};
        let template: Template | undefined = undefined;

        if (canGenerateScript) {
            script = await this.scriptService.generateScript(video);
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
                this.videoService.init(template);
                await this.videoService.initRender();
            }

            return { result: "Video created" };
        } catch (error) {
            throw new HttpException(error as Record<string, any>, HttpStatus.BAD_REQUEST);
        }
    }
}
