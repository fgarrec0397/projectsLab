import { Module } from "@nestjs/common";

import { UsersModule } from "../users/users.module";
import { UsageService } from "./usage.service";

@Module({
    imports: [UsersModule],
    providers: [UsageService],
    exports: [UsageService],
})
export class UsageModule {}
