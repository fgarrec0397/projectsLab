"use client";

import { Typography } from "@mui/material";

import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { useGetPricingPlans } from "@/services/plansService/hooks/useGetPricingPlans";
import { useGetUser } from "@/services/usersService/hooks/useGetUserById";
import { fDate } from "@/utils/format-time";

import SubscriptionPricinPlans from "../components/subscription-pricing-plans";

// ----------------------------------------------------------------------

export default function SubscriptionsView() {
    const { plans, isPlansLoading } = useGetPricingPlans();
    const { user, isUserLoading } = useGetUser();

    return (
        <PageWrapper
            title={"Subscription plans"}
            isLoading={isPlansLoading && isUserLoading}
            subContent={
                <>
                    {user?.billingStartsAt && user?.billingEndsAt ? (
                        <Typography>
                            Current billing usage: {fDate(user?.billingStartsAt)} -
                            {fDate(user?.billingEndsAt)}
                        </Typography>
                    ) : undefined}
                    <Typography>Usage cycle restarts on {fDate(user?.usageCycleEndsAt)}</Typography>
                </>
            }
        >
            {user !== undefined && <SubscriptionPricinPlans plans={plans} user={user} />}
        </PageWrapper>
    );
}
