import { BullModule } from "@nestjs/bull";
import { forwardRef, Global, Module } from "@nestjs/common";
import { VideoProcessingModule } from "src/modules/video-processing/video-processing.module";

import { VideoProcessingProcessor } from "./processors/video-processing.processor";
import { JobsService } from "./services/jobs.service";

@Global()
@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: "localhost",
                port: 6379,
            },
        }),
        BullModule.registerQueue({
            name: "render-video",
        }),
        forwardRef(() => VideoProcessingModule),
    ],
    providers: [JobsService, VideoProcessingProcessor],
    exports: [JobsService, VideoProcessingProcessor],
})
export class JobsModule {}
