export type User = {
    displayName?: string;
    email?: string;
    id: string;
    currentPlanId?: string;
    currentPlanPriceId?: string;
    subscriptionId?: string;
    usageCycleEndsAt?: number;
    billingEndsAt?: number;
    billingStartsAt?: number;
    subscriptionStatus?: string;
    allowedStorage: number;
    allowedVideos: number;
    usedStorage: number;
    usedVideos: number;
    hasEarlyAdopterBadge?: boolean;
};
