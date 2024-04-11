import { Injectable, RawBodyRequest } from "@nestjs/common";
import { EventName, SubscriptionNotification } from "@paddle/paddle-node-sdk";
import { Request } from "express";
import { addMonth } from "src/common/dates/dates.utils";
import { PaymentService } from "src/common/payment/services/payment.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { UsersService } from "../users/users.service";

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly payment: PaymentService,
        private readonly usersService: UsersService,
        @InjectDatabase() private readonly database: DatabaseConfig
    ) {}

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

                switch (eventData.eventType) {
                    case EventName.SubscriptionCreated:
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
                                usageCycleEndsAt,
                                subscriptionStatus,
                                allowedStorage: plan.allowedStorage,
                                allowedVideos: plan.allowedVideos,
                            });
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
