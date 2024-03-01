import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { VideoEventsGateway } from "./gateways/video-events.gateway";
import {
    Script,
    ScriptGeneratorService,
} from "./submodules/script-generator/script-generator.service";
import {
    InjectTemplateGenerator,
    TemplateGeneratorService,
} from "./submodules/template-generator/template-generator.service";
import { VideoRendererService } from "./submodules/video-renderer/video-renderer.service";
import { Template } from "./submodules/video-renderer/video-renderer.types";
import { VideoProcessingStepDataStatus } from "./video-processing.types";

const canGenerateScript = true;
const canGenerateTemplate = false;
const canRenderVideo = false;

@Injectable()
export class VideoProcessingService {
    constructor(
        private readonly scriptService: ScriptGeneratorService,
        @InjectTemplateGenerator() private readonly templateService: TemplateGeneratorService,
        private readonly videoService: VideoRendererService,
        private readonly eventsGateway: VideoEventsGateway
    ) {}

    async renderVideo() {
        let script: Script = {};
        let template: Template | undefined = undefined;

        if (canGenerateScript) {
            this.eventsGateway.notifyVideoProcessStep({
                status: VideoProcessingStepDataStatus.GeneratingScript,
            });

            script = await this.scriptService.generateScript();

            this.eventsGateway.notifyVideoProcessStep({
                status: VideoProcessingStepDataStatus.ScriptGenerated,
                data: script,
            });
        }

        if (canGenerateTemplate) {
            this.eventsGateway.notifyVideoProcessStep({
                status: VideoProcessingStepDataStatus.GeneratingTemplate,
            });

            this.templateService.prepareTemplate(script);

            template = await this.templateService.createTemplate();

            this.eventsGateway.notifyVideoProcessStep({
                status: VideoProcessingStepDataStatus.TemplateGenerated,
            });

            if (!template) {
                throw new HttpException(
                    "An issue happened and the template was not generated",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }

        try {
            if (!canRenderVideo) {
                return { result: "Video not created" };
            }

            if (template) {
                this.eventsGateway.notifyVideoProcessStep({
                    status: VideoProcessingStepDataStatus.Rendering,
                });

                this.videoService.init(template);

                await this.videoService.initRender();

                this.eventsGateway.notifyVideoProcessStep({
                    status: VideoProcessingStepDataStatus.Rendered,
                });

                return { result: "Video created" };
            }

            throw new HttpException(
                "An issue happened and the video was not generated",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        } catch (error) {
            throw new HttpException(error as Record<string, any>, HttpStatus.BAD_REQUEST);
        }
    }
}
