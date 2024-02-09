import { Module } from "@nestjs/common";
import { ConfigModule as EnvConfigModule } from "@nestjs/config";

import { CacheModule } from "./common/cache/cache.module";
import { ConfigModule } from "./config.module";
import { FilesModule } from "./modules/files/files.module";
import { AuthModule } from "./modules/session/auth.module";
import { SessionSerializer } from "./modules/session/session.serializer";
import { VideoModule } from "./modules/video/video.module";

@Module({
    imports: [
        EnvConfigModule.forRoot({ isGlobal: true }),
        ConfigModule,
        CacheModule,
        AuthModule,
        VideoModule,
        FilesModule,
    ],
    providers: [SessionSerializer],
})
export class AppModule {}
