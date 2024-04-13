import { Injectable, RawBodyRequest } from "@nestjs/common";
import { EventName, SubscriptionNotification } from "@paddle/paddle-node-sdk";
import { Request } from "express";
import { addMonth } from "src/common/dates/dates.utils";
import { PaymentService } from "src/common/payment/services/payment.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { PlansService } from "../plans/plans.service";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.types";

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly payment: PaymentService,
        private readonly usersService: UsersService,
        private readonly plansService: PlansService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {}

    async getCurrentSubscription(userId: string) {
        const user = await this.usersService.getUserById(userId);

        return user.currentPlanId;
    }

    async updateSubscription(userId: string, newPriceId: string, isPreview = false) {
        const user = await this.usersService.getUserById(userId);
        return this.payment.updatePlan(
            user.subscriptionId,
            newPriceId,
            user.currentPlanPriceId,
            isPreview
        );
    }

    async handleWebhook(request: RawBodyRequest<Request>) {
        const signature = (request.headers["paddle-signature"] as string) || "";
        const rawRequestBody = request.rawBody.toString();
        const secretKey = process.env.PADDLE_WEBHOOK_SECRET || "";

        try {
            if (signature && rawRequestBody) {
                const eventData = this.payment.paddle.webhooks.unmarshal(
                    rawRequestBody,
                    secretKey,
                    signature
                );

                if (!eventData) {
                    throw new Error("Signature invalid");
                }

                console.log(JSON.stringify(eventData), "eventData");

                if (eventData.eventType === EventName.SubscriptionCreated) {
                    const subscriptionData = eventData.data as SubscriptionNotification;
                    const priceData = subscriptionData.items[0].price;
                    const plan = await this.payment.getPricingPlanById(priceData.productId);
                    const userId = (subscriptionData.customData as any).userId;
                    const usageCycleEndsAt = addMonth(
                        new Date(subscriptionData.currentBillingPeriod.startsAt).getTime()
                    );
                    const subscriptionStatus = subscriptionData.status;

                    console.log(`Subscription ${eventData.data.id} was created`);

                    try {
                        await this.usersService.updateUser(userId, {
                            currentPlanId: priceData.productId,
                            currentPlanPriceId: priceData.id,
                            usageCycleEndsAt,
                            subscriptionStatus,
                            subscriptionId: subscriptionData.id,
                            allowedStorage: plan.allowedStorage,
                            allowedVideos: plan.allowedVideos,
                            hasEarlyAdopterBadge: true,
                        });
                    } catch (error) {
                        console.error(error);
                    }
                } else if (eventData.eventType === EventName.SubscriptionCanceled) {
                    try {
                        const subscriptionData = eventData.data as SubscriptionNotification;
                        const userId = (subscriptionData.customData as any).userId;
                        const freePlan = await this.plansService.getFreePlan();

                        await this.usersService.updateUser(userId, {
                            currentPlanId: "free",
                            currentPlanPriceId: "",
                            subscriptionStatus: "free",
                            allowedStorage: freePlan.allowedStorage,
                            allowedVideos: freePlan.allowedVideos,
                        });
                    } catch (error) {
                        console.error(error);
                    }
                } else if (eventData.eventType === EventName.SubscriptionUpdated) {
                    console.log(`Subscription ${eventData.data.id} was updated`);
                } else {
                    console.log(eventData.eventType);
                }
            } else {
                console.log("Signature missing in header");
            }
        } catch (e) {
            console.log(e);
        }
    }
}
