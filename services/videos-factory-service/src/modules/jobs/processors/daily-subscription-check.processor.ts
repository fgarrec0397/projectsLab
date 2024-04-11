import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";
import { UsersService } from "src/modules/users/users.service";

export const dailySubscriptionCheckKey = "daily-subscription-check";

export const InjectDailySubscriptionCheckQueue = () => InjectQueue(dailySubscriptionCheckKey);

@Processor(dailySubscriptionCheckKey)
export class DailySubscriptionCheckProcessor {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        readonly usersService: UsersService
    ) {}

    @Process("check-subscription")
    async handleRecurringJob() {
        // console.log("Refilling usage");
        // await this.usersService.refillUsersUsage();
    }
}
