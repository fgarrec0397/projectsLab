import { BullModule } from "@nestjs/bull";
import { Global, Module } from "@nestjs/common";
import { NotificationsModule } from "src/modules/notifications/notifications.module";

import { VideoProcessingModule } from "../video-processing/video-processing.module";
import { VideosModule } from "../videos/videos.module";
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
        NotificationsModule,
        VideoProcessingModule,
        VideosModule,
    ],
    providers: [JobsService],
    exports: [JobsService],
})
export class JobsModule {}
