import {
    createCheckout,
    getPrice,
    getProduct,
    lemonSqueezySetup,
    listPrices,
    listProducts,
    Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { uidGenerator } from "@projectslab/helpers";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { Plan, Subscription, WebhookEvent } from "../payment.type";

@Injectable()
export class PaymentService implements OnModuleInit {
    constructor(@InjectDatabase() private readonly database: DatabaseConfig) {}

    onModuleInit() {
        const requiredVars = [
            "LEMONSQUEEZY_API_KEY",
            "LEMONSQUEEZY_STORE_ID",
            "LEMONSQUEEZY_WEBHOOK_SECRET",
        ];

        const missingVars = requiredVars.filter((varName) => !process.env[varName]);

        if (missingVars.length > 0) {
            throw new Error(
                `Missing required LEMONSQUEEZY env variables: ${missingVars.join(
                    ", "
                )}. Please, set them in your .env file.`
            );
        }

        lemonSqueezySetup({
            apiKey: process.env.LEMONSQUEEZY_API_KEY,
            onError: (error) => {
                throw new Error(`Lemon Squeezy API error: ${error}`);
            },
        });
    }

    async getPricingPlans() {
        try {
            return await listProducts({
                filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
                include: ["variants"],
            });
        } catch (error) {
            console.log(error);
        }
    }

    async syncPlans() {
        const productVariants: Plan[] = await this.database.findAll("plans");

        const addVariant = async (variant: Plan) => {
            // eslint-disable-next-line no-console -- allow
            console.log(`Syncing variant ${variant.name} with the database...`);

            // Sync the variant with the plan in the database.
            await this.database.createOrUpdate("plans", variant);

            /* eslint-disable no-console -- allow */
            console.log(`${variant.name} synced with the database...`);

            productVariants.push(variant);
        };

        const products = await listProducts({
            filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
            include: ["variants"],
        });
        console.log(JSON.stringify(products), "products");

        const allVariants = products.data?.included as Variant["data"][] | undefined;

        if (allVariants) {
            console.log(JSON.stringify(allVariants), "allVariants");
            for (const [index, v] of allVariants.entries()) {
                const variant = v.attributes;

                if (
                    variant.status === "draft" ||
                    (allVariants.length !== 1 && variant.status === "pending")
                ) {
                    continue;
                }

                const productName =
                    (await getProduct(variant.product_id)).data?.data.attributes.name ?? "";

                const variantPriceObject = await listPrices({
                    filter: {
                        variantId: v.id,
                    },
                });

                const currentPriceObj = variantPriceObject.data?.data.at(0);
                console.log(currentPriceObj, "currentPriceObj");
                const isUsageBased = currentPriceObj?.attributes.usage_aggregation !== null;
                const interval = currentPriceObj?.attributes.renewal_interval_unit;
                const intervalCount = currentPriceObj?.attributes.renewal_interval_quantity;
                const trialInterval = currentPriceObj?.attributes.trial_interval_unit;
                const trialIntervalCount = currentPriceObj?.attributes.trial_interval_quantity;

                const price = isUsageBased
                    ? currentPriceObj?.attributes.unit_price_decimal
                    : currentPriceObj.attributes.unit_price;

                const priceString = price !== null ? price?.toString() ?? "" : "";

                const isFreePlan = currentPriceObj?.attributes.category === "lead_magnet";
                const canAddVariant =
                    currentPriceObj?.attributes.category === "subscription" || isFreePlan;

                if (!canAddVariant) {
                    continue;
                }

                await addVariant({
                    id: v.id,
                    name: variant.name,
                    description: variant.description,
                    price: priceString,
                    interval,
                    intervalCount,
                    isUsageBased,
                    productId: variant.product_id,
                    productName,
                    variantId: parseInt(v.id) as unknown as number,
                    trialInterval,
                    trialIntervalCount,
                    sort: isFreePlan ? 0 : index,
                });
            }
        }

        return productVariants;
    }

    async getCheckoutURL(variantId: number, user: { userId?: string; email: string }) {
        console.log(variantId, "variantId");
        console.log(process.env.STORE_FRONT_URL, "process.env.STORE_FRONT_URL");

        try {
            const checkout = await createCheckout(process.env.LEMONSQUEEZY_STORE_ID!, variantId, {
                checkoutData: {
                    email: user.email ?? undefined,
                    custom: {
                        user_id: user.userId,
                    },
                },
                productOptions: {
                    enabledVariants: [variantId],
                    redirectUrl: `${process.env.STORE_FRONT_URL}/dashboard/`,
                    receiptButtonText: "Go to Dashboard",
                },
            });

            console.log(checkout, "checkout");

            return checkout.data?.data.attributes.url;
        } catch (error) {
            console.log(error);
        }
    }

    async storeWebhookEvent(eventName: string, body: WebhookEvent["body"]): Promise<WebhookEvent> {
        const id = uidGenerator();

        // Attempt to find an existing document
        const existingDoc = await this.database.findOne("webhookEvents", String(id));

        // If the document exists, effectively do nothing
        if (existingDoc) {
            console.log(`Document with ID ${id} already exists. Skipping insertion.`);
            return null; // Adjust based on how you want to handle this case
        }

        // If no existing document, insert the new document
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
            throw error; // Rethrow or handle as appropriate for your application
        }
    }

    async processWebhookEvent(webhookEvent: WebhookEvent) {
        // const dbwebhookEvent = await this.database.findOne("webhookEvents", webhookEvent.id);

        // if (!process.env.WEBHOOK_URL) {
        //     throw new Error(
        //         "Missing required WEBHOOK_URL env variable. Please, set it in your .env file."
        //     );
        // }

        let processingError = "";
        const eventBody = webhookEvent.body;

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

                // We assume that the Plan table is up to date.
                const plans = await this.database.findWithQuery<Plan>("plans", {
                    conditions: [
                        { field: "variantId", operator: "==", value: parseInt(variantId, 10) },
                    ],
                });

                if (plans.length < 1) {
                    processingError = `Plan with variantId ${variantId} not found.`;
                } else {
                    // Update the subscription in the database.

                    const priceId = attributes.first_subscription_item.price_id;

                    // Get the price data from Lemon Squeezy.
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

                    // Create/update subscription in the database.
                    try {
                        await this.database.createOrUpdate("subscriptions", subscription);
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

            // Update the webhook event in the database.
            await this.database.update("webhookEvents", webhookEvent.id, {
                processed: true,
                processingError,
            });
        }
    }
}
