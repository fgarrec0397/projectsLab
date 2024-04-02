import { Module } from "@nestjs/common";
import { ConfigModule as EnvConfigModule } from "@nestjs/config";

import { CacheModule } from "./common/cache/cache.module";
import { FileSystemModule } from "./common/files-system/file-system.module";
import { PaymentModule } from "./common/payment/payment.module";
import { BaseWebSocketModule } from "./common/websocket/base-websocket.module";
import { ConfigModule } from "./config.module";
import { AuthModule } from "./modules/auth/auth.module";
import { FilesModule } from "./modules/files/files.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PlansModule } from "./modules/plans/plans.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { UsersModule } from "./modules/users/users.module";
import { VideoProcessingModule } from "./modules/video-processing/video-processing.module";
import { VideosModule } from "./modules/videos/videos.module";

@Module({
    imports: [
        EnvConfigModule.forRoot({ isGlobal: true }),
        ConfigModule,
        CacheModule,
        FileSystemModule,
        JobsModule,
        PaymentModule,
        NotificationsModule,
        BaseWebSocketModule,
        AuthModule,
        UsersModule,
        VideoProcessingModule,
        VideosModule,
        FilesModule,
        SubscriptionsModule,
        PlansModule,
    ],
})
export class AppModule {}
