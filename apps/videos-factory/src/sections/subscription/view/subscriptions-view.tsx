"use client";

import { Button, Divider, Typography } from "@mui/material";
import { Stack } from "@mui/system";

import { useAuthContext } from "@/auth/hooks";
import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { useBoolean } from "@/hooks/use-boolean";
import { useGetCurrentPlan } from "@/services/plansService/hooks/useGetCurrentPlan";
import { useGetPricingPlans } from "@/services/plansService/hooks/useGetPricingPlans";
import { pxToRem } from "@/theme/typography";
import { fDate } from "@/utils/format-time";

import SubscriptionPlanUpdateDialog from "../components/subscription-plan-update-dialog";
import SubscriptionPricinPlans from "../components/subscription-pricing-plans";

// ----------------------------------------------------------------------

export default function SubscriptionsView() {
    const { plans, isPlansLoading } = useGetPricingPlans();
    const { user } = useAuthContext();
    const isUpdateOpened = useBoolean();
    const { currentPlan } = useGetCurrentPlan();

    const onSubscriptionSubmit = () => {
        window.location.reload();
    };

    return (
        <PageWrapper
            title={"Subscription plans"}
            isLoading={isPlansLoading}
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
                                    onSubscriptionSubmit={onSubscriptionSubmit}
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
