import { Injectable } from "@nestjs/common";
import { PaymentService } from "src/common/payment/services/payment.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

@Injectable()
export class BillingService {
    constructor(
        private readonly payment: PaymentService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {}

    async syncPlans() {
        await this.payment.syncPlans();
    }

    async getPlans() {
        await this.payment.syncPlans(); // TODO - remove this once user admins are created and a sync button is added
        const plans = await this.database.findAll("plans");

        console.log(plans, "plans");

        return plans;
    }
}
