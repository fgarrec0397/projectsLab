import { Injectable, OnModuleInit } from "@nestjs/common";
import { Queue } from "bull";

import { InjectDailySubscriptionCheckQueue } from "../processors/daily-subscription-check.processor";

@Injectable()
export class SchedulerService implements OnModuleInit {
    constructor(
        @InjectDailySubscriptionCheckQueue() private readonly dailySubscriptionCheckQueue: Queue
    ) {}

    async onModuleInit() {
        console.log("onModuleInit");

        // await this.scheduleDailySubscriptionCheckJob();
    }

    async scheduleDailySubscriptionCheckJob() {
        await this.dailySubscriptionCheckQueue.add("check-subscription", undefined, {
            repeat: { cron: "*/30 * * * * *" },
        });
    }
}
