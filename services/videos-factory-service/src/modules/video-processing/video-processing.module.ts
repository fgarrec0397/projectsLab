import { Module } from "@nestjs/common";

import { NotificationsModule } from "../notifications/notifications.module";
import { VideoProcessingService } from "./services/video-processing.service";
import { ScriptGeneratorModule } from "./submodules/script-generator/script-generator.module";
import { TemplateGeneratorModule } from "./submodules/template-generator/template-generator.module";

@Module({
    imports: [NotificationsModule, ScriptGeneratorModule, TemplateGeneratorModule],
    providers: [VideoProcessingService],
    exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
