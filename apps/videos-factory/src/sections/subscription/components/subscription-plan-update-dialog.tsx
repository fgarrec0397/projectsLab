import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    CircularProgress,
    Divider,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    Typography,
} from "@mui/material";
import { CardProps } from "@mui/material/Card";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import { ConfirmDialog } from "@/components/custom-dialog";
import { useSnackbar } from "@/components/snackbar";
import { useBoolean } from "@/hooks/use-boolean";
import { updateSubscription } from "@/services/subscriptionsService/subscriptionsService";
import { pxToRem } from "@/theme/typography";
import { IPlan } from "@/types/billing";
import { getPrice } from "@/utils/lemon-squeezy";

import SubscriptionCheckoutSummary from "./subscription-checkout-summary";

// ----------------------------------------------------------------------

type Props = CardProps & {
    plan: IPlan;
    open: boolean;
    onClose: () => void;
};

export default function SubscriptionPlanUpdateDialog({ plan, open, onClose }: Props) {
    const [subscriptionPreview, setSubscriptionPreview] = useState<any>();
    const { user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const [priceId, setPriceId] = useState(plan.yearlyPriceId);
    const isLoadingSubscription = useBoolean();
    const isSubmitting = useBoolean();

    useEffect(() => {
        const fetchPreviewUpdateSubscription = async () => {
            isLoadingSubscription.onTrue();
            const subscription = await updateSubscription(user?.accessToken, priceId, true);
            setSubscriptionPreview(subscription);
            isLoadingSubscription.onFalse();
        };

        fetchPreviewUpdateSubscription();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.accessToken, priceId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPriceId((event.target as HTMLInputElement).value);
    };

    const onChangePlanClick = async () => {
        try {
            isSubmitting.onTrue();
            await submitPlanChange();
            enqueueSnackbar(`Plan changed with success!`, { variant: "success" });
            onClose();
        } catch (error) {
            enqueueSnackbar(`Something went wrong`, {
                variant: "error",
            });
        } finally {
            isSubmitting.onFalse();
        }
    };

    const submitPlanChange = async () => {
        return updateSubscription(user?.accessToken, priceId);
    };

    const renderPreviewContent = (
        <Box sx={{ minHeight: pxToRem(440) }}>
            <Stack direction="row" alignItems="center">
                <RadioGroup>
                    <FormLabel id="billing-cycle-label" defaultValue={plan.yearlyPriceId}>
                        Billing cycle
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="billing-cycle-label"
                        name="billing-cycle"
                        onChange={handleChange}
                        value={priceId}
                    >
                        <FormControlLabel
                            value={plan.yearlyPriceId}
                            control={<Radio />}
                            label="Yearly"
                        />
                        <FormControlLabel
                            value={plan.monthlyPriceId}
                            control={<Radio />}
                            label="Monthly"
                        />
                    </RadioGroup>
                </RadioGroup>
                {isLoadingSubscription.value && <CircularProgress size={20} sx={{ mt: 2 }} />}
            </Stack>
            <Divider sx={{ my: 2 }} />
            {!isLoadingSubscription.value &&
                (subscriptionPreview?.updateSummary === null ? (
                    <Stack spacing={2}>
                        <Typography variant="subtitle1">
                            This is your current subscription
                        </Typography>
                        <Typography>Select another billing cycle to see the preview</Typography>
                    </Stack>
                ) : (
                    <SubscriptionCheckoutSummary
                        subTotal={getPrice(
                            subscriptionPreview?.immediateTransaction?.details?.lineItems?.[0]
                                .totals?.subtotal
                        )}
                        taxes={getPrice(
                            subscriptionPreview?.immediateTransaction?.details?.lineItems?.[0]
                                .totals?.tax
                        )}
                        totalWithTaxes={getPrice(
                            subscriptionPreview?.updateSummary?.charge?.amount
                        )}
                        credit={getPrice(subscriptionPreview?.updateSummary?.credit?.amount)}
                        total={getPrice(subscriptionPreview?.updateSummary?.result?.amount)}
                        frequency={subscriptionPreview?.billingCycle?.interval}
                        action={subscriptionPreview?.updateSummary?.result?.action}
                    />
                ))}
        </Box>
    );

    return (
        <>
            <ConfirmDialog
                open={open}
                onClose={onClose}
                title={`Switch to ${plan.name}`}
                content={renderPreviewContent}
                sx={{ px: 4 }}
                action={
                    <>
                        <LoadingButton
                            onClick={onChangePlanClick}
                            loading={isSubmitting.value}
                            loadingPosition="end"
                            variant="contained"
                            color="primary"
                            disabled={
                                subscriptionPreview?.updateSummary === null ||
                                isLoadingSubscription.value
                            }
                        >
                            Change plan
                        </LoadingButton>
                    </>
                }
            />
        </>
    );
}
