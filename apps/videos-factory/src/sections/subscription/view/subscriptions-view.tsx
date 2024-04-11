"use client";

import { Typography } from "@mui/material";

import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { useGetPricingPlans } from "@/services/plansService/hooks/useGetPricingPlans";

import SubscriptionPricinPlans from "../components/subscription-pricing-plans";

// ----------------------------------------------------------------------

export default function SubscriptionsView() {
    const { plans, isPlansLoading } = useGetPricingPlans();

    return (
        <PageWrapper
            title={"Subscription plans"}
            isLoading={isPlansLoading}
            subContent={
                <Typography>
                    Transparent and predictable prices to start gaining traction. No credit cards
                    required
                </Typography>
            }
        >
            <SubscriptionPricinPlans plans={plans} />
        </PageWrapper>
    );
}
