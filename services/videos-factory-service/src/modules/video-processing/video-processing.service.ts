import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CacheService } from "src/common/cache/cache.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { IVideo } from "../videos/videos.types";
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
        private readonly eventsGateway: VideoEventsGateway,
        @InjectDatabase() private readonly database: DatabaseConfig,
        private readonly cacheService: CacheService
    ) {}

    async renderVideo(userId: string, video: IVideo) {
        let script: Script = {};
        let template: Template | undefined = undefined;

        if (canGenerateScript) {
            await this.notifyClient(userId, video, VideoProcessingStepDataStatus.GeneratingScript);

            script = await this.scriptService.generateScript();

            await this.notifyClient(userId, video, VideoProcessingStepDataStatus.ScriptGenerated);
        }

        if (canGenerateTemplate) {
            await this.notifyClient(
                userId,
                video,
                VideoProcessingStepDataStatus.GeneratingTemplate
            );

            this.templateService.prepareTemplate(script);

            template = await this.templateService.createTemplate();

            await this.notifyClient(userId, video, VideoProcessingStepDataStatus.TemplateGenerated);

            if (!template) {
                throw new HttpException(
                    "An issue happened and the template was not generated",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }

        try {
            if (!canRenderVideo) {
                return;
            }

            if (template) {
                await this.notifyClient(userId, video, VideoProcessingStepDataStatus.Rendering);

                this.videoService.init(template);

                await this.videoService.initRender();

                await this.notifyClient(userId, video, VideoProcessingStepDataStatus.Rendered);

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

    private async notifyClient(
        userId: string,
        video: IVideo,
        status: VideoProcessingStepDataStatus
    ) {
        const videoCollectionPath = `users/${userId}/videos`;

        await this.database.update(videoCollectionPath, video.id, {
            ...video,
            status,
        });

        this.eventsGateway.notifyVideoProcessStep({
            status,
            data: video,
        });
    }
}
