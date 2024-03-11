import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { VideoEventsGateway } from "./gateways/video-events.gateway";
import { VideoProcessingService } from "./services/video-processing.service";
import { ScriptGeneratorModule } from "./submodules/script-generator/script-generator.module";
import { TemplateGeneratorModule } from "./submodules/template-generator/template-generator.module";
import { VideoProcessingProcessor } from "./video-processing.processor";

@Module({
    imports: [
        BullModule.registerQueue({
            name: "video-rendering",
        }),
        ScriptGeneratorModule,
        TemplateGeneratorModule,
    ],
    providers: [VideoProcessingProcessor, VideoProcessingService, VideoEventsGateway],
    exports: [VideoProcessingProcessor, VideoProcessingService],
})
export class VideoProcessingModule {}
