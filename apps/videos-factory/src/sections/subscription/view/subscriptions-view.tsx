"use client";

import { Button, Divider, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useMemo } from "react";

import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { useBoolean } from "@/hooks/use-boolean";
import { useGetPricingPlans } from "@/services/plansService/hooks/useGetPricingPlans";
import { useGetUser } from "@/services/usersService/hooks/useGetUserById";
import { pxToRem } from "@/theme/typography";
import { fDate } from "@/utils/format-time";

import SubscriptionPlanUpdateDialog from "../components/subscription-plan-update-dialog";
import SubscriptionPricinPlans from "../components/subscription-pricing-plans";

// ----------------------------------------------------------------------

export default function SubscriptionsView() {
    const { plans, isPlansLoading } = useGetPricingPlans();
    const { user, isUserLoading } = useGetUser();
    const isUpdateOpened = useBoolean();
    const currentPlan = useMemo(
        () => plans.find((x) => x.id === user?.currentPlanId),
        [plans, user?.currentPlanId]
    );

    return (
        <PageWrapper
            title={"Subscription plans"}
            isLoading={isPlansLoading && isUserLoading}
            subContent={
                <>
                    {user?.billingStartsAt && user?.billingEndsAt ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography>
                                Current billing cycle:{" "}
                                <strong>
                                    {fDate(user?.billingStartsAt)} -{fDate(user?.billingEndsAt)}
                                </strong>
                            </Typography>
                            <Button
                                sx={{ mt: pxToRem(-4) }}
                                color="primary"
                                onClick={isUpdateOpened.onTrue}
                            >
                                Change billing cycle
                            </Button>
                            {isUpdateOpened.value && currentPlan !== undefined && (
                                <SubscriptionPlanUpdateDialog
                                    plan={currentPlan}
                                    open={isUpdateOpened.value}
                                    onClose={isUpdateOpened.onFalse}
                                />
                            )}
                        </Stack>
                    ) : undefined}
                    <Typography>
                        Usage cycle restarts on <strong>{fDate(user?.usageCycleEndsAt)}</strong>
                    </Typography>
                    <Divider />
                </>
            }
        >
            {user !== undefined && <SubscriptionPricinPlans plans={plans} user={user} />}
        </PageWrapper>
    );
}
