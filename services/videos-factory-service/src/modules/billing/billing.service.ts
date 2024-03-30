import crypto from "node:crypto";

import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { Plan } from "src/common/payment/payment.type";
import { PaymentService } from "src/common/payment/services/payment.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

// import { processWebhookEvent, storeWebhookEvent } from "@/app/actions";

type MappedPlan = {
    id: number;
    name: string;
    variants: Plan[];
};

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
        const plans = await this.database.findWithQuery<Plan>("plans", {
            orderByField: "sort",
            orderByDirection: "asc",
        });
        const mappedPlans: MappedPlan[] = [];

        plans.forEach((x) => {
            const mappedPlan: MappedPlan = {
                name: x.productName,
                id: x.productId,
                variants: [x],
            };

            const planIndex = mappedPlans.findIndex((plan) => plan.id === x.productId);
            const isPlanExist = planIndex !== -1;

            if (!isPlanExist) {
                return mappedPlans.push(mappedPlan);
            }

            mappedPlans[planIndex].variants.push(x);
        });

        // console.log(JSON.stringify(plans), "plans");
        // console.log(JSON.stringify(mappedPlans), "mappedPlans");

        return mappedPlans;
    }

    async getCheckoutURL(variantId: number, user: { userId?: string; email: string }) {
        return this.payment.getCheckoutURL(variantId, user);
    }

    async handleWebhook(body: Body) {
        if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
            return new Response("Lemon Squeezy Webhook Secret not set in .env", {
                status: 500,
            });
        }

        // First, make sure the request is from Lemon Squeezy.
        const rawBody = await body.text();
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
        const signature = Buffer.from((body as any).headers?.get("X-Signature") || "", "utf8");

        if (!crypto.timingSafeEqual(digest, signature)) {
            throw new Error("Invalid signature.");
        }

        const data = JSON.parse(rawBody) as unknown;

        // Type guard to check if the object has a 'meta' property.
        if (this.webhookHasMeta(data)) {
            const webhookEventId = await this.payment.storeWebhookEvent(
                (data as any).meta.event_name,
                data
            );

            // Non-blocking call to process the webhook event.
            void this.payment.processWebhookEvent(webhookEventId);

            return new Response("OK", { status: 200 });
        }

        return new Response("Data invalid", { status: 400 });
    }

    private webhookHasMeta(data: any) {
        return !!data.meta;
    }
}
