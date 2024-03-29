import {
    getProduct,
    lemonSqueezySetup,
    listPrices,
    listProducts,
    Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { Plan } from "../payment.type";

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
                throw new Error(`Lemon Squeezy API error: ${error.message}`);
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
                const isUsageBased = currentPriceObj?.attributes.usage_aggregation !== null;
                const interval = currentPriceObj?.attributes.renewal_interval_unit;
                const intervalCount = currentPriceObj?.attributes.renewal_interval_quantity;
                const trialInterval = currentPriceObj?.attributes.trial_interval_unit;
                const trialIntervalCount = currentPriceObj?.attributes.trial_interval_quantity;

                const price = isUsageBased
                    ? currentPriceObj?.attributes.unit_price_decimal
                    : currentPriceObj.attributes.unit_price;

                const priceString = price !== null ? price?.toString() ?? "" : "";

                const isSubscription = currentPriceObj?.attributes.category === "subscription";

                if (!isSubscription) {
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
                    sort: index,
                });
            }
        }

        return productVariants;
    }
}
