import { Module } from "@nestjs/common";
import { ConfigModule as EnvConfigModule } from "@nestjs/config";

import { CacheModule } from "./common/cache/cache.module";
import { ConfigModule } from "./config.module";
import { AuthModule } from "./modules/auth/auth.module";
import { FilesModule } from "./modules/files/files.module";
import { TemplateGeneratorModule } from "./modules/template-generator/template-generator.module";
import { VideoProcessingModule } from "./modules/video-processing/video-processing.module";
import { VideoRendererModule } from "./modules/video-renderer/video-renderer.module";
import { VideosModule } from "./modules/videos/videos.module";

@Module({
    imports: [
        EnvConfigModule.forRoot({ isGlobal: true }),
        ConfigModule,
        CacheModule,
        AuthModule,
        TemplateGeneratorModule,
        VideoProcessingModule,
        VideoRendererModule,
        VideosModule,
        FilesModule,
    ],
})
export class AppModule {}
