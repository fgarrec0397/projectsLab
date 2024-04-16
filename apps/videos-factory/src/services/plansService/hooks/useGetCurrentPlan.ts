import { useMemo } from "react";

import { useAuthContext } from "@/auth/hooks";
import { IPlan } from "@/types/billing";

import { useGetPricingPlans } from "./useGetPricingPlans";

const freePlan: IPlan = {
    id: "free",
    name: "Free",
    description: "",
    subDescription: "",
    monthlyPrice: "",
    monthlyPriceId: "",
    yearlyPrice: "",
    yearlyPriceId: "",
    features: [],
    moreFeatures: [],
    sort: 0,
};

export const useGetCurrentPlan = () => {
    const { plans, isPlansLoading } = useGetPricingPlans();
    const { user } = useAuthContext();
    const currentPlan = useMemo(() => {
        if (user?.currentPlanId === freePlan.id) {
            return freePlan;
        }

        return plans.find((x) => x.id === user?.currentPlanId);
    }, [plans, user?.currentPlanId]);

    return {
        currentPlan,
        isCurrentPlanLoading: isPlansLoading,
    };
};
