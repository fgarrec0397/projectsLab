import { forwardRef, Module } from "@nestjs/common";

import { NotificationsModule } from "../notifications/notifications.module";
import { UsersModule } from "../users/users.module";
import { VideosModule } from "../videos/videos.module";
import { UsageService } from "./usage.service";

@Module({
    imports: [UsersModule, forwardRef(() => VideosModule), NotificationsModule],
    providers: [UsageService],
    exports: [UsageService],
})
export class UsageModule {}
