import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

import { AuthModule } from "./modules/session/auth.module";
import { SessionSerializer } from "./modules/session/session.serializer";
import { VideoModule } from "./modules/video/video.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ session: true }),
        AuthModule,
        VideoModule,
    ],
    providers: [SessionSerializer],
})
export class AppModule {}
