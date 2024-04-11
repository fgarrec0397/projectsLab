import { Controller, Post, RawBodyRequest, Req } from "@nestjs/common";
import { Request } from "express";

import { Public } from "../auth/decorators/use-public.guard";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private readonly subscriptionService: SubscriptionsService) {}

    @Post("webhook")
    @Public()
    async catchWebhook(@Req() request: RawBodyRequest<Request>) {
        console.log("webhook triggered");

        await this.subscriptionService.handleWebhook(request);
    }
}
