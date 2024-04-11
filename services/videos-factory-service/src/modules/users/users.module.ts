import { Module } from "@nestjs/common";

import { PlansModule } from "../plans/plans.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
@Module({
    controllers: [UsersController],
    imports: [PlansModule],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
