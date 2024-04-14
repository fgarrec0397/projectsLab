import {
    Body,
    Controller,
    ParseBoolPipe,
    Patch,
    Post,
    Query,
    RawBodyRequest,
    Req,
} from "@nestjs/common";
import { Request } from "express";

import { Public } from "../auth/decorators/use-public.guard";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private readonly subscriptionService: SubscriptionsService) {}

    @Patch("update")
    async updateSubscription(
        @Req() request: Request,
        @Body("newPriceId") newPriceId: string,
        @Query("isPreview", ParseBoolPipe) isPreview: boolean
    ) {
        return this.subscriptionService.updateSubscription(request.userId, newPriceId, isPreview);
    }

    @Patch("cancel")
    async cancelSubscription(@Req() request: Request, @Body("reason") reason: string) {
        return this.subscriptionService.cancelSubscription(request.userId, reason);
    }

    @Post("webhook")
    @Public()
    async catchWebhook(@Req() request: RawBodyRequest<Request>) {
        console.log("webhook triggered");

        await this.subscriptionService.handleWebhook(request);
    }
}
