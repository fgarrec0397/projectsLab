import { Controller, Get, Post, Query, RawBodyRequest, Req } from "@nestjs/common";
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

    @Get("checkout")
    getCheckoutURL(
        @Req() request: Request,
        @Query("variantId") variantId: string,
        @Query("email") email: string
    ) {
        return this.subscriptionService.getCheckoutURL(Number(variantId), {
            userId: request.userId,
            email,
        });
    }

    @Post("webhook")
    @Public()
    async catchWebhook(@Req() request: RawBodyRequest<Request>) {
        await this.subscriptionService.handleWebhook(request);
    }
}
