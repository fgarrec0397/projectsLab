import { Module } from "@nestjs/common";

import { ScriptGeneratorModule } from "../script-generator/script-generator.module";
import { TemplateGeneratorModule } from "../template-generator/template-generator.module";
import { VideoRendererModule } from "../video-renderer/video-renderer.module";
import { VideoProcessingService } from "./video-processing.service";

@Module({
    imports: [ScriptGeneratorModule, TemplateGeneratorModule, VideoRendererModule],
    providers: [VideoProcessingService],
    exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
