import { Injectable, RawBodyRequest } from "@nestjs/common";
import { EventName, SubscriptionNotification } from "@paddle/paddle-node-sdk";
import { Request } from "express";
import { Plan } from "src/common/payment/payment.type";
import { PaymentService } from "src/common/payment/services/payment.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { UsersService } from "../users/users.service";
import { Subscription } from "./subscriptions.types";

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly payment: PaymentService,
        private readonly usersService: UsersService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {}

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
            await this.database.createOrUpdate(subscriptionCollectionPath, {
                ...subscription,
                subscriptionId: subscription.id,
                id: "current",
            });
            await this.usersService.updateUser(userId, {
                currentPlanId: subscription.productId,
                billingStartsAt: subscription.startsAt,
                billingEndsAt: subscription.endsAt,
            });

            return subscription;
        } catch (error) {
            console.log(error);
        }
    }

    async updateSubscription(userId: string, subscription: Subscription) {
        const subscriptionCollectionPath = `users/${userId}/subscriptions`;

        try {
            await this.database.createOrUpdate(subscriptionCollectionPath, subscription);
            await this.usersService.updateUser(userId, {
                currentPlanId: undefined,
            });

            return subscription;
        } catch (error) {
            console.log(error);
        }
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

                console.log(eventData.eventType, "eventData.eventType");
                switch (eventData.eventType) {
                    case EventName.SubscriptionCreated:
                        const subscriptionData = eventData.data as SubscriptionNotification;

                        console.log(`Subscription ${eventData.data.id} was created`);

                        const subscription: Subscription = {
                            id: eventData.data.id,
                            transactionId: eventData.data.transactionId,
                            status: subscriptionData.status,
                            startsAt: new Date(
                                subscriptionData.currentBillingPeriod.startsAt
                            ).getTime(),
                            endsAt: new Date(
                                subscriptionData.currentBillingPeriod.endsAt
                            ).getTime(),
                            price: subscriptionData.items[0].price.unitPrice.amount,
                            productId: subscriptionData.items[0].price.productId,
                            userId: (subscriptionData.customData as any).userId,
                        };

                        try {
                            await this.createSubscription(subscription.userId, subscription);
                        } catch (error) {
                            console.error(error);
                        }
                        break;
                    case EventName.SubscriptionCanceled:
                        break;
                    case EventName.SubscriptionUpdated:
                        console.log(`Subscription ${eventData.data.id} was updated`);
                        break;
                    default:
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
