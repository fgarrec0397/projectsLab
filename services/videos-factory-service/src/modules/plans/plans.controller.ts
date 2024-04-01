import { Controller, Get, Post } from "@nestjs/common";

import { Public } from "../auth/decorators/use-public.guard";
import { PlansService } from "./plans.service";

@Controller("plans")
export class PlansController {
    constructor(private readonly billingService: PlansService) {}

    @Post("plans/sync")
    syncPlans() {
        this.billingService.syncPlans();
    }

    @Get()
    @Public()
    getPlans() {
        return this.billingService.getPlans();
    }
}
