import crypto from "node:crypto";

import { getPrice } from "@lemonsqueezy/lemonsqueezy.js";
import { HttpException, HttpStatus, Injectable, RawBodyRequest } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import { Request } from "express";
import { Plan } from "src/common/payment/payment.type";
import { PaymentService } from "src/common/payment/services/payment.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { Subscription, WebhookEvent } from "./subscriptions.types";

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly payment: PaymentService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {}

    async getCheckoutURL(variantId: number, user: { userId?: string; email: string }) {
        return this.payment.getCheckoutURL(variantId, user);
    }

    async getUserSubscriptions(userId: string) {
        const subscriptionCollectionPath = `users/${userId}/subscriptions`;

        const subscriptions = await this.database.findWithQuery<Subscription>(
            subscriptionCollectionPath,
            {
                orderByField: "createdAt",
                orderByDirection: "desc",
            }
        );

        return subscriptions;
    }

    async getCurrentPlan(userId: string) {
        const subscriptionCollectionPath = `users/${userId}/subscriptions`;

        const currentPlan = await this.database.findWithQuery<Plan>(subscriptionCollectionPath, {
            orderByField: "createdAt",
            orderByDirection: "desc",
        });

        return currentPlan;
    }

    async createSubscription(userId: string, subscription: Subscription) {
        const subscriptionCollectionPath = `users/${userId}/subscriptions`;

        try {
            await this.database.createOrUpdate(subscriptionCollectionPath, subscription);

            return subscription;
        } catch (error) {
            console.log(error);
        }
    }

    async handleWebhook(request: RawBodyRequest<Request>) {
        const rawBody = request.rawBody;

        if (!this.isWebhookCallValid(request)) {
            throw new Error("Invalid signature.");
        }

        const data = JSON.parse(rawBody as any) as unknown;

        if (this.webhookHasMeta(data)) {
            const webhookEvent = await this.storeWebhookEvent((data as any).meta.event_name, data);

            void this.processWebhookEvent(webhookEvent);

            return { status: 200 };
        }

        throw new HttpException("Data invalid", HttpStatus.BAD_REQUEST);
    }

    private async processWebhookEvent(webhookEvent: WebhookEvent) {
        let processingError = "";
        const eventBody = webhookEvent.body;
        const userId = eventBody.meta.custom_data.user_id;

        if (!eventBody.meta) {
            processingError = "Event body is missing the 'meta' property.";
        } else if (eventBody.meta) {
            if (webhookEvent.eventName.startsWith("subscription_payment_")) {
                // Save subscription invoices; eventBody is a SubscriptionInvoice
                // Not implemented.
            } else if (webhookEvent.eventName.startsWith("subscription_")) {
                // Save subscription events; obj is a Subscription
                const attributes = eventBody.data.attributes;
                const variantId = attributes.variant_id as string;

                const plans = await this.database.findWithQuery<Plan>("plans", {
                    conditions: [
                        { field: "variantId", operator: "==", value: parseInt(variantId, 10) },
                    ],
                });

                if (plans.length < 1) {
                    processingError = `Plan with variantId ${variantId} not found.`;
                } else {
                    const priceId = attributes.first_subscription_item.price_id;

                    const priceData = await getPrice(priceId);
                    if (priceData.error) {
                        processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
                    }

                    const isUsageBased = attributes.first_subscription_item.is_usage_based;
                    const price = isUsageBased
                        ? priceData.data?.data.attributes.unit_price_decimal
                        : priceData.data?.data.attributes.unit_price;

                    const subscription: Subscription = {
                        id: eventBody.data.id,
                        lemonSqueezyId: eventBody.data.id,
                        orderId: attributes.order_id as number,
                        name: attributes.user_name as string,
                        email: attributes.user_email as string,
                        status: attributes.status as string,
                        statusFormatted: attributes.status_formatted as string,
                        renewsAt: attributes.renews_at as string,
                        endsAt: attributes.ends_at as string,
                        trialEndsAt: attributes.trial_ends_at as string,
                        price: price?.toString() ?? "",
                        isPaused: false,
                        subscriptionItemId: attributes.first_subscription_item.id,
                        isUsageBased: attributes.first_subscription_item.is_usage_based,
                        userId: eventBody.meta.custom_data.user_id,
                        planId: plans[0].id,
                    };

                    try {
                        await this.createSubscription(userId, subscription);
                    } catch (error) {
                        processingError = `Failed to upsert Subscription #${subscription.lemonSqueezyId} to the database.`;
                        console.error(error);
                    }
                }
            } else if (webhookEvent.eventName.startsWith("order_")) {
                // Save orders; eventBody is a "Order"
                /* Not implemented */
            } else if (webhookEvent.eventName.startsWith("license_")) {
                // Save license keys; eventBody is a "License key"
                /* Not implemented */
            }

            await this.database.update("webhookEvents", webhookEvent.id, {
                processed: true,
                processingError,
            });
        }
    }

    private async storeWebhookEvent(
        eventName: string,
        body: WebhookEvent["body"]
    ): Promise<WebhookEvent> {
        const id = uidGenerator();

        const existingDoc = await this.database.findOne("webhookEvents", String(id));

        if (existingDoc) {
            console.log(`Document with ID ${id} already exists. Skipping insertion.`);
            return null;
        }

        try {
            const webhookEvent: WebhookEvent = {
                id,
                eventName,
                processed: false,
                body,
                createdAt: new Date().getTime(),
                processingError: "",
            };
            await this.database.createOrUpdate("webhookEvents", webhookEvent);

            return webhookEvent;
        } catch (error) {
            console.error(`Failed to insert webhook event: ${error}`);
        }
    }

    private webhookHasMeta(data: any) {
        return !!data.meta;
    }

    private isWebhookCallValid(request: RawBodyRequest<Request>) {
        if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
            throw new Error("Lemon Squeezy Webhook Secret not set in .env");
        }

        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(request.rawBody).digest("hex"), "utf8");
        const signature = Buffer.from(request.get("X-Signature") || "", "utf8");

        return crypto.timingSafeEqual(digest, signature);
    }
}
