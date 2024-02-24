import { Module } from "@nestjs/common";

import { ScriptGeneratorModule } from "./submodules/script-generator/script-generator.module";
import { TemplateGeneratorModule } from "./submodules/template-generator/template-generator.module";
import { VideoRendererModule } from "./submodules/video-renderer/video-renderer.module";
import { VideoProcessingService } from "./video-processing.service";

@Module({
    imports: [ScriptGeneratorModule, TemplateGeneratorModule, VideoRendererModule],
    providers: [VideoProcessingService],
    exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
