export type Plan = {
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

export type WebhookEvent = {
    id: string;
    createdAt: number;
    eventName: string;
    processed: boolean;
    body: any;
    processingError: string;
};

export type Subscription = {
    id: string;
    lemonSqueezyId: string;
    orderId: number;
    name: string;
    email: string;
    statusFormatted: string;
    status: string;
    renewsAt: string;
    endsAt: string;
    trialEndsAt: string;
    price: string;
    isUsageBased: boolean;
    isPaused: boolean;
    subscriptionItemId: string;
    userId: string;
    planId: string;
};
