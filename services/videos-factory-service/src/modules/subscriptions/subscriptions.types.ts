export type WebhookEvent = {
    id: string;
    createdAt: string;
    eventName: string;
    status: string;
    body: any;
    processingError: string;
};

export type Subscription = {
    id: string;
    transactionId: string;
    status: string;
    startsAt: number;
    endsAt: number;
    price: string;
    productId: string;
    userId: string;
};
