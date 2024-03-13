import { BullModule } from "@nestjs/bull";
import { Global, Module } from "@nestjs/common";

import { VideoProcessingModule } from "../modules/video-processing/video-processing.module";
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
        VideoProcessingModule,
    ],
    providers: [JobsService],
    exports: [JobsService],
})
export class JobsModule {}
