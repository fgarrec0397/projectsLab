import { BullModule } from "@nestjs/bull";
import { forwardRef, Module } from "@nestjs/common";
import { NotificationsModule } from "src/modules/notifications/notifications.module";

import { UsersModule } from "../users/users.module";
import { VideoProcessingModule } from "../video-processing/video-processing.module";
import { VideosModule } from "../videos/videos.module";
import {
    dailySubscriptionCheckKey,
    DailySubscriptionCheckProcessor,
} from "./processors/daily-subscription-check.processor";
import { SchedulerService } from "./services/scheduler.service";
import { VideoRenderingJobService } from "./services/video-rendering-jobs.service";

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: "localhost",
                port: 6379,
            },
        }),
        BullModule.registerQueue({
            name: dailySubscriptionCheckKey,
        }),
        NotificationsModule,
        VideoProcessingModule,
        forwardRef(() => VideosModule),
        forwardRef(() => UsersModule),
    ],
    providers: [VideoRenderingJobService, SchedulerService, DailySubscriptionCheckProcessor],
    exports: [VideoRenderingJobService],
})
export class JobsModule {}
