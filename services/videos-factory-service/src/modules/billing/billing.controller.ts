import {
    Body,
    Controller,
    Get,
    HttpException,
    Post,
    Query,
    RawBodyRequest,
    Req,
} from "@nestjs/common";
import { Request } from "express";

import { Public } from "../auth/decorators/use-public.guard";
import { BillingService } from "./billing.service";

@Controller("billing")
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @Get("plans/sync")
    syncPlans() {
        this.billingService.syncPlans();
    }

    @Get("plans")
    getPlans() {
        return this.billingService.getPlans();
    }

    @Get("checkout")
    getCheckoutURL(
        @Req() request: Request,
        @Query("variantId") variantId: string,
        @Query("email") email: string
    ) {
        return this.billingService.getCheckoutURL(Number(variantId), {
            userId: request.userId,
            email,
        });
    }

    @Post("webhook")
    @Public()
    async catchWebhook(@Req() request: RawBodyRequest<Request>, @Body() body: Body) {
        console.log("webhook triggered");
        console.log(body, "body");
        console.log(request.headers, "request.headers");

        await this.billingService.handleWebhook(request);
    }
}
