import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";

import { JobsModule } from "../jobs/jobs.module";
import { UsageModule } from "../usage/usage.module";
import { UsersModule } from "../users/users.module";
import { VideoDataMiddleware } from "./middlewares/video-data.middleware";
import { VideosService } from "./services/videos.service";
import { VideosController } from "./videos.controller";

@Module({
    imports: [
        forwardRef(() => JobsModule),
        forwardRef(() => UsersModule),
        forwardRef(() => UsageModule),
    ],
    controllers: [VideosController],
    providers: [VideosService],
    exports: [VideosService],
})
export class VideosModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VideoDataMiddleware).forRoutes(VideosController);
    }
}
