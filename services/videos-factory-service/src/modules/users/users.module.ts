import { Module } from "@nestjs/common";

import { PlansModule } from "../plans/plans.module";
import { VideosModule } from "../videos/videos.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
@Module({
    controllers: [UsersController],
    imports: [PlansModule, VideosModule],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
