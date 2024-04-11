export type User = {
    displayName?: string;
    email?: string;
    id: string;
    currentPlanId?: string;
    usageCycleEndsAt?: number;
    subscriptionStatus?: string;
    allowedStorage: number;
    allowedVideos: number;
    usedStorage: number;
    usedVideos: number;
    hasEarlyAdopterBadge?: boolean;
};
