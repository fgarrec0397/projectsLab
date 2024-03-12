import { Module } from "@nestjs/common";

import { VideoEventsGateway } from "./gateways/video-events.gateway";
import { VideoProcessingService } from "./services/video-processing.service";
import { ScriptGeneratorModule } from "./submodules/script-generator/script-generator.module";
import { TemplateGeneratorModule } from "./submodules/template-generator/template-generator.module";

@Module({
    imports: [ScriptGeneratorModule, TemplateGeneratorModule],
    providers: [VideoProcessingService, VideoEventsGateway],
    exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
