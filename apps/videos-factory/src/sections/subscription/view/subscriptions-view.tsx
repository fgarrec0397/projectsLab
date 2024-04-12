"use client";

import { Typography } from "@mui/material";

import { useAuthContext } from "@/auth/hooks";
import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { useGetPricingPlans } from "@/services/plansService/hooks/useGetPricingPlans";
import { useGetUser } from "@/services/usersService/hooks/useGetUserById";
import { fDate } from "@/utils/format-time";

import SubscriptionPricinPlans from "../components/subscription-pricing-plans";

// ----------------------------------------------------------------------

export default function SubscriptionsView() {
    const { plans, isPlansLoading } = useGetPricingPlans();
    const { user, isUserLoading } = useGetUser();

    console.log(user, "user");

    return (
        <PageWrapper
            title={"Subscription plans"}
            isLoading={isPlansLoading && isUserLoading}
            subContent={
                <Typography>Usage cycle restarts: {fDate(user?.usageCycleEndsAt)}</Typography>
            }
        >
            <SubscriptionPricinPlans plans={plans} />
        </PageWrapper>
    );
}
