import { Module } from "@nestjs/common";
import { ConfigModule as EnvConfigModule } from "@nestjs/config";

import { CacheModule } from "./common/cache/cache.module";
import { BaseWebSocketModule } from "./common/websocket/base-websocket.module";
import { ConfigModule } from "./config.module";
import { JobsModule } from "./jobs/jobs.module";
import { AuthModule } from "./modules/auth/auth.module";
import { FilesModule } from "./modules/files/files.module";
import { VideoProcessingModule } from "./modules/video-processing/video-processing.module";
import { VideosModule } from "./modules/videos/videos.module";

@Module({
    imports: [
        EnvConfigModule.forRoot({ isGlobal: true }),
        ConfigModule,
        JobsModule,
        BaseWebSocketModule,
        CacheModule,
        AuthModule,
        VideoProcessingModule,
        VideosModule,
        FilesModule,
    ],
})
export class AppModule {}
