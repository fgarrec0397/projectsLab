import { Module } from "@nestjs/common";
import { PaymentModule } from "src/common/payment/payment.module";

import { PlansModule } from "../plans/plans.module";
import { VideosModule } from "../videos/videos.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
@Module({
    controllers: [UsersController],
    imports: [PlansModule, VideosModule, PaymentModule],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
