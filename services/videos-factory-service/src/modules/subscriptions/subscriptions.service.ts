import { Injectable, RawBodyRequest } from "@nestjs/common";
import { EventName, SubscriptionNotification } from "@paddle/paddle-node-sdk";
import { Request } from "express";
import { addMonth } from "src/common/dates/dates.utils";
import { PaymentService } from "src/common/payment/services/payment.service";

import { UsersService } from "../users/users.service";

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly payment: PaymentService,
        private readonly usersService: UsersService
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

    async cancelSubscription(userId: string, reason: string) {
        const user = await this.usersService.getUserById(userId);

        const cancelReasons = user.cancelReasons || [];

        await this.usersService.updateUser(user.id, {
            cancelReasons: [...cancelReasons, reason],
        });

        return this.payment.cancelPlan(user.subscriptionId);
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

                console.log(eventData.eventType, "eventData.eventType");

                if (!eventData) {
                    throw new Error("Signature invalid");
                }

                if (eventData.eventType === EventName.SubscriptionCreated) {
                    const subscriptionData = eventData.data as SubscriptionNotification;
                    const priceData = subscriptionData.items[0].price;
                    const plan = await this.payment.getPricingPlanById(priceData.productId);
                    const userId = (subscriptionData.customData as any).userId;
                    const usageCycleEndsAt = addMonth(
                        new Date(subscriptionData.currentBillingPeriod.startsAt).getTime()
                    );
                    const billingStartsAt = new Date(
                        subscriptionData.currentBillingPeriod.startsAt
                    ).getTime();
                    const billingEndsAt = new Date(
                        subscriptionData.currentBillingPeriod.endsAt
                    ).getTime();
                    const subscriptionStatus = subscriptionData.status;

                    console.log(`Subscription ${eventData.data.id} was created`);

                    try {
                        await this.usersService.updateUser(userId, {
                            currentPlanId: priceData.productId,
                            currentPlanPriceId: priceData.id,
                            usageCycleEndsAt,
                            subscriptionStatus,
                            billingStartsAt,
                            billingEndsAt,
                            subscriptionId: subscriptionData.id,
                            allowedStorage: plan.allowedStorage,
                            allowedVideos: plan.allowedVideos,
                            hasEarlyAdopterBadge: true,
                        });
                    } catch (error) {
                        console.error(error);
                    }
                } else if (
                    eventData.eventType === EventName.SubscriptionCanceled ||
                    eventData.eventType === EventName.SubscriptionPastDue
                ) {
                    try {
                        console.log(`Subscription ${eventData.data.id} was cancelled`);

                        const subscriptionData = eventData.data as SubscriptionNotification;
                        const userId = (subscriptionData.customData as any).userId;

                        await this.usersService.updateUser(userId, {
                            currentPlanId: "free",
                            currentPlanPriceId: "",
                            subscriptionStatus: "canceled",
                            billingStartsAt: 0,
                            billingEndsAt: 0,
                        });
                    } catch (error) {
                        console.error(error);
                    }
                } else if (eventData.eventType === EventName.SubscriptionUpdated) {
                    console.log(`Subscription ${eventData.data.id} was updated`);
                    const subscriptionData = eventData.data as SubscriptionNotification;
                    const priceData = subscriptionData.items[0].price;
                    const plan = await this.payment.getPricingPlanById(priceData.productId);
                    const userId = (subscriptionData.customData as any).userId;
                    const billingStartsAt = new Date(
                        subscriptionData.currentBillingPeriod.startsAt
                    ).getTime();
                    const billingEndsAt = new Date(
                        subscriptionData.currentBillingPeriod.endsAt
                    ).getTime();
                    const usageCycleEndsAt = addMonth(
                        new Date(subscriptionData.currentBillingPeriod.startsAt).getTime()
                    );
                    const subscriptionStatus = subscriptionData.status;

                    try {
                        await this.usersService.updateUser(userId, {
                            currentPlanId: priceData.productId,
                            currentPlanPriceId: priceData.id,
                            usageCycleEndsAt,
                            subscriptionStatus,
                            billingStartsAt,
                            billingEndsAt,
                            subscriptionId: subscriptionData.id,
                            allowedStorage: plan.allowedStorage,
                            allowedVideos: plan.allowedVideos,
                        });
                    } catch (error) {
                        console.error(error);
                    }
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
