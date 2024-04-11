export type WebhookEvent = {
    id: string;
    createdAt: string;
    eventName: string;
    status: string;
    body: any;
    processingError: string;
};
