import { Controller, Get, Post, RawBodyRequest, Req } from "@nestjs/common";
import { Request } from "express";

import { Public } from "../auth/decorators/use-public.guard";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private readonly subscriptionService: SubscriptionsService) {}

    @Get()
    getSubscriptions(@Req() request: Request) {
        return this.subscriptionService.getUserSubscriptions(request.userId);
    }

    @Get("currentPlan")
    getCurrentPlan(@Req() request: Request) {
        return this.subscriptionService.getCurrentPlan(request.userId);
    }

    @Post("webhook")
    @Public()
    async catchWebhook(@Req() request: RawBodyRequest<Request>) {
        console.log("webhook triggered");

        await this.subscriptionService.handleWebhook(request);
    }
}
