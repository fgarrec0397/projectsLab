import { Injectable, OnModuleInit } from "@nestjs/common";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
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
        this.paddle = new Paddle(process.env.PADDLE_API_KEY, {
            environment: Environment.sandbox, // or Environment.sandbox for accessing sandbox API
        });
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

    async getPricingPlanById(id: string) {
        try {
            return await this.database.findOne<Plan>("plans", id);
        } catch (error) {
            console.log(error);
        }
    }

    async updatePlan(
        subscriptionId: string,
        newPricingId: string,
        oldPricingId: string,
        isPreview = false
    ) {
        try {
            const currentSubscription = await this.paddle.subscriptions.get(subscriptionId);
            const currentItems = currentSubscription.items
                .map((x) => ({
                    priceId: x.price.id,
                    quantity: x.quantity,
                }))
                .filter((x) => x.priceId !== oldPricingId);

            if (isPreview) {
                return await this.paddle.subscriptions.previewUpdate(subscriptionId, {
                    prorationBillingMode: "prorated_immediately",
                    items: [...currentItems, { priceId: newPricingId, quantity: 1 }],
                });
            }

            return await this.paddle.subscriptions.update(subscriptionId, {
                prorationBillingMode: "prorated_immediately",
                items: [...currentItems, { priceId: newPricingId, quantity: 1 }],
            });
        } catch (error) {
            console.log(error);
        }
    }

    async cancelPlan(subscriptionId: string) {
        return this.paddle.subscriptions.cancel(subscriptionId, { effectiveFrom: "immediately" });
    }

    async syncPlans() {
        const productVariants: Plan[] = await this.database.findAll("plans");

        const addPlan = async (plan: Plan) => {
            await this.database.createOrUpdate("plans", plan);

            productVariants.push(plan);
        };

        const plans = await this.getPricingPlans();

        if (plans) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const [index, plan] of plans.entries()) {
                const { id, name, description, customData } = plan;

                const plansOrder = {
                    Free: 0,
                    Essentials: 1,
                    Growth: 1,
                };

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

                const subDescription = Object.entries(customData)
                    .map(([key, value]) => {
                        if (key.includes("subDescription")) {
                            return value as string;
                        }
                    })
                    .filter((x) => x !== undefined && x !== null);

                const allowedVideos = Object.entries(customData)
                    .map(([key, value]) => {
                        if (key.includes("allowed_videos")) {
                            return value as string;
                        }
                    })
                    .filter((x) => x !== undefined && x !== null)[0];

                const allowedStorage = Object.entries(customData)
                    .map(([key, value]) => {
                        if (key.includes("allowed_storage")) {
                            return value as string;
                        }
                    })
                    .filter((x) => x !== undefined && x !== null)[0];

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
                    subDescription: subDescription[0],
                    monthlyPrice: (prices as TempPrice).monthly.price,
                    monthlyPriceId: (prices as TempPrice).monthly.id,
                    yearlyPrice: (prices as TempPrice).yearly.price,
                    yearlyPriceId: (prices as TempPrice).yearly.id,
                    features,
                    moreFeatures,
                    sort: plansOrder[plan.name],
                    allowedVideos,
                    allowedStorage,
                });

                await addPlan({
                    id,
                    name,
                    description,
                    subDescription: subDescription[0],
                    monthlyPrice: (prices as TempPrice).monthly.price,
                    monthlyPriceId: (prices as TempPrice).monthly.id,
                    yearlyPrice: (prices as TempPrice).yearly.price,
                    yearlyPriceId: (prices as TempPrice).yearly.id,
                    features,
                    moreFeatures,
                    sort: plansOrder[plan.name],
                    allowedVideos: Number(allowedVideos),
                    allowedStorage: Number(allowedStorage),
                });
            }
        }

        return productVariants;
    }
}
