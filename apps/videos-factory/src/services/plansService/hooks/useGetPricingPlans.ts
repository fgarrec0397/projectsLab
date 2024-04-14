"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { getPricingPlans } from "../plansService";

export const useGetPricingPlans = () => {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        "pricingPlans",
        () => getPricingPlans(),
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
            mutatePlans: mutate,
        }),
        [data, isLoading, error, isValidating, mutate]
    );

    return memoizedResponse;
};
