import { MiddlewareConsumer, Module } from "@nestjs/common";

import { VideoDataMiddleware } from "./middlewares/video-data.middleware";
import { VideosService } from "./services/videos.service";
import { VideosController } from "./videos.controller";

@Module({
    controllers: [VideosController],
    providers: [VideosService],
    exports: [VideosService],
})
export class VideosModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VideoDataMiddleware).forRoutes(VideosController);
    }
}
