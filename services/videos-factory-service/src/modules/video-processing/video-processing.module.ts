import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { VideoEventsGateway } from "./gateways/video-events.gateway";
import { VIDEO_RENDERING_PROCESS } from "./processors/video-processing.processor";
import { VideoProcessingService } from "./services/video-processing.service";
import { ScriptGeneratorModule } from "./submodules/script-generator/script-generator.module";
import { TemplateGeneratorModule } from "./submodules/template-generator/template-generator.module";

@Module({
    imports: [
        BullModule.registerQueue({
            name: VIDEO_RENDERING_PROCESS,
        }),
        ScriptGeneratorModule,
        TemplateGeneratorModule,
    ],
    providers: [VideoProcessingService, VideoEventsGateway],
    exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
