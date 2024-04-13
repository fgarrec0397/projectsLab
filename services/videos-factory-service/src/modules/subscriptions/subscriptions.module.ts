import { Module } from "@nestjs/common";

import { PlansModule } from "../plans/plans.module";
import { UsersModule } from "../users/users.module";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";

@Module({
    imports: [UsersModule, PlansModule],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
