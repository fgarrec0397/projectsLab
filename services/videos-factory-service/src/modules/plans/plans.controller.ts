import { Controller, Get, Post } from "@nestjs/common";

import { Public } from "../auth/decorators/use-public.guard";
import { PlansService } from "./plans.service";

@Controller("plans")
export class PlansController {
    constructor(private readonly plansService: PlansService) {}

    @Post("plans/sync")
    syncPlans() {
        this.plansService.syncPlans();
    }

    @Get()
    @Public()
    getPlans() {
        return this.plansService.getPlans();
    }
}
