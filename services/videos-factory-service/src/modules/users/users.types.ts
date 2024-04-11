export type User = {
    displayName: string;
    email: string;
    uid: string;
    currentPlanId?: string;
    billingStartsAt: number;
    billingEndsAt: number;
};
