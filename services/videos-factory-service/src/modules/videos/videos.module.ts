import { Module } from "@nestjs/common";

import { VideoProcessingModule } from "../video-processing/video-processing.module";
import { VideosService } from "./services/videos.service";
import { VideosController } from "./videos.controller";

@Module({
    controllers: [VideosController],
    imports: [VideoProcessingModule],
    providers: [VideosService],
})
export class VideosModule {}
