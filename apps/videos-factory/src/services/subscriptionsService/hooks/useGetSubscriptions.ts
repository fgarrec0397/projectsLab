"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";

import { getPricingPlans } from "../billingService";

export const useGetPricingPlans = () => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating } = useSWR(
        "pricingPlans",
        () => getPricingPlans(auth.user?.accessToken),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    const memoizedResponse = useMemo(
        () => ({
            plans: data || [],
            isPlansLoading: isLoading,
            plansError: error,
            isPlansValidating: isValidating,
        }),
        [data, isLoading, error, isValidating]
    );

    return memoizedResponse;
};
