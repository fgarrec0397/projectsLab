import {
    createCheckout,
    getProduct,
    lemonSqueezySetup,
    listPrices,
    listProducts,
    Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Paddle } from "@paddle/paddle-node-sdk";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { Plan } from "../payment.type";

type PriceName = "monthly" | "yearly";
type TempPrice = Record<
    PriceName,
    {
        id: string;
        price: string;
        name: string;
    }
>;

@Injectable()
export class PaymentService implements OnModuleInit {
    paddle: Paddle;

    constructor(@InjectDatabase() private readonly database: DatabaseConfig) {}

    onModuleInit() {
        this.paddle = new Paddle(process.env.PADDLE_API_KEY);
    }

    async getPricingPlans() {
        try {
            return await this.paddle.products
                .list({
                    include: ["prices", "customData", "importMeta"],
                })
                .next();
        } catch (error) {
            console.log(error);
        }
    }

    async syncPlans() {
        const productVariants: Plan[] = await this.database.findAll("plans");

        // for (const plan of plans) {
        //     await this.database.createOrUpdate("plans", plan);
        // }
        const addPlan = async (plan: Plan) => {
            await this.database.createOrUpdate("plans", plan);

            productVariants.push(plan);
        };

        const plans = await this.getPricingPlans();
        // console.log(JSON.stringify(plans), "plans");

        if (plans) {
            for (const [index, plan] of plans.entries()) {
                // if (plan.status !== "active" || plans.length !== 1) {
                //     continue;
                // }

                const { id, name, description, customData } = plan;

                const isFreePlan = name === "Free";

                const prices: TempPrice | object = {};

                const features = Object.entries(customData)
                    .map(([key, value]) => {
                        if (key.includes("features_")) {
                            return value as string;
                        }
                    })
                    .filter((x) => x !== undefined && x !== null);

                const moreFeatures = Object.entries(customData)
                    .map(([key, value]) => {
                        if (key.includes("moreFeatures_")) {
                            return value as string;
                        }
                    })
                    .filter((x) => x !== undefined && x !== null);

                plan.prices.forEach((x) => {
                    prices[x.name as PriceName] = {
                        id: x.id,
                        price: x.unitPrice.amount,
                        name: x.name,
                    };
                });

                console.log({
                    id,
                    name,
                    description,
                    monthlyPrice: (prices as TempPrice).monthly.price,
                    monthlyPriceId: (prices as TempPrice).monthly.id,
                    yearlyPrice: (prices as TempPrice).yearly.price,
                    yearlyPriceId: (prices as TempPrice).yearly.id,
                    features,
                    moreFeatures,
                    sort: isFreePlan ? 0 : index + 1,
                });

                await addPlan({
                    id,
                    name,
                    description,
                    monthlyPrice: (prices as TempPrice).monthly.price,
                    monthlyPriceId: (prices as TempPrice).monthly.id,
                    yearlyPrice: (prices as TempPrice).yearly.price,
                    yearlyPriceId: (prices as TempPrice).yearly.id,
                    features,
                    moreFeatures,
                    sort: isFreePlan ? 0 : index + 1,
                });
            }
        }

        return productVariants;
    }

    async getCheckoutURL(variantId: number, user: { userId?: string; email: string }) {
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

            return checkout.data?.data.attributes.url;
        } catch (error) {
            console.log(error);
        }
    }
}
