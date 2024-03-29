import { Controller, Get } from "@nestjs/common";

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
}