export type IPlan = {
    id: string;
    productId: number;
    productName: string;
    variantId: number;
    name: string;
    description: string;
    price: string;
    isUsageBased: boolean;
    interval: string;
    intervalCount: number;
    trialInterval: string;
    trialIntervalCount: number;
    sort: number;
};
