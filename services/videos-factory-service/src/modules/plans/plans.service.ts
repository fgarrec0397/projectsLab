import { Injectable } from "@nestjs/common";
import { Plan } from "src/common/payment/payment.type";
import { PaymentService } from "src/common/payment/services/payment.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

type MappedPlan = {
    id: number;
    name: string;
    variants: Plan[];
};

@Injectable()
export class PlansService {
    constructor(
        private readonly payment: PaymentService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {}

    async syncPlans() {
        await this.payment.syncPlans();
    }

    async getPlans() {
        await this.payment.syncPlans(); // TODO - remove this once user admins are created and a sync button is added

        // const plans = await this.database.findWithQuery<Plan>("plans", {
        //     orderByField: "sort",
        //     orderByDirection: "asc",
        // });

        const mappedPlans: MappedPlan[] = [];

        // plans.forEach((x) => {
        //     const mappedPlan: MappedPlan = {
        //         name: x.productName,
        //         id: x.productId,
        //         variants: [x],
        //     };

        //     const planIndex = mappedPlans.findIndex((plan) => plan.id === x.productId);
        //     const isPlanExist = planIndex !== -1;

        //     if (!isPlanExist) {
        //         return mappedPlans.push(mappedPlan);
        //     }

        //     mappedPlans[planIndex].variants.push(x);
        // });

        return mappedPlans;
    }
}
