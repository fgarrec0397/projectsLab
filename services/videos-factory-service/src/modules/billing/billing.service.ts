import { Injectable } from "@nestjs/common";
import { PaymentService } from "src/common/payment/services/payment.service";

@Injectable()
export class BillingService {
    constructor(private readonly payment: PaymentService) {}

    async getPlans() {
        const plans = await this.payment.syncPlans();

        console.log(plans, "plans");

        return plans;
    }
}
