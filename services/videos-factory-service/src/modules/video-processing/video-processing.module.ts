import { forwardRef, Module } from "@nestjs/common";

import { NotificationsModule } from "../notifications/notifications.module";
import { UsageModule } from "../usage/usage.module";
import { VideoProcessingService } from "./services/video-processing.service";
import { ScriptGeneratorModule } from "./submodules/script-generator/script-generator.module";
import { TemplateGeneratorModule } from "./submodules/template-generator/template-generator.module";

@Module({
    imports: [
        NotificationsModule,
        ScriptGeneratorModule,
        TemplateGeneratorModule,
        forwardRef(() => UsageModule),
    ],
    providers: [VideoProcessingService],
    exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
