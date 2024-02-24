import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { IVideo } from "../videos/videosTypes";
import {
    Script,
    ScriptGeneratorService,
} from "./submodules/script-generator/script-generator.service";
import { TemplateGeneratorService } from "./submodules/template-generator/template-generator.service";
import { VideoRendererService } from "./submodules/video-renderer/video-renderer.service";
import { Template } from "./submodules/video-renderer/video-renderer.types";

const canGenerateScript = true;
const canGenerateTemplate = false;
const canRenderVideo = false;

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
