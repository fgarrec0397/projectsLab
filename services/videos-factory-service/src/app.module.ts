import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

import { FilesModule } from "./modules/files/files.module";
import { AuthModule } from "./modules/session/auth.module";
import { SessionSerializer } from "./modules/session/session.serializer";
import { VideoModule } from "./modules/video/video.module";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, VideoModule, FilesModule],
    providers: [SessionSerializer],
})
export class AppModule {}
