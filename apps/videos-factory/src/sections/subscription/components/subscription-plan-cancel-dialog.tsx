import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Divider, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { CardProps } from "@mui/material/Card";
import Grid from "@mui/system/Unstable_Grid";
import { useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import { ConfirmDialog } from "@/components/custom-dialog";
import { useSnackbar } from "@/components/snackbar";
import { useBoolean } from "@/hooks/use-boolean";
import { cancelSubscription } from "@/services/subscriptionsService/subscriptionsService";
import { IPlan } from "@/types/billing";

// ----------------------------------------------------------------------

type Props = CardProps & {
    plan: IPlan;
    open: boolean;
    onClose: () => void;
};

export default function SubscriptionPlanCancelDialog({ open, onClose }: Props) {
    const { user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const [reason, setReason] = useState<string>("does-not-fill-need");
    const isSubmitting = useBoolean();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReason((event.target as HTMLInputElement).value);
    };

    const onChangePlanClick = async () => {
        try {
            isSubmitting.onTrue();
            await submitCancelPlan();
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

    const submitCancelPlan = async () => {
        return cancelSubscription(user?.accessToken, reason);
    };

    const renderPreviewContent = (
        <Box>
            Your subscription will be canceled, but your remaining usage will be available until the
            current usage cycle ends
            <Divider sx={{ my: 2 }} />
            <RadioGroup row={false}>
                <FormLabel id="cancel-reason-label">Cancel reason</FormLabel>
                <RadioGroup
                    aria-labelledby="cancel-reason-label"
                    name="cancel-reason"
                    onChange={handleChange}
                    value={reason}
                >
                    <Grid container>
                        <Grid xs={6} sx={{ display: "flex", flexDirection: "column" }}>
                            <FormControlLabel
                                value="too-expensive"
                                control={<Radio />}
                                label="Too expensive"
                            />
                            <FormControlLabel
                                value="too-buggy"
                                control={<Radio />}
                                label="Too buggy"
                            />
                            <FormControlLabel
                                value="functionality-lack"
                                control={<Radio />}
                                label="Lack of functionality"
                            />
                        </Grid>
                        <Grid xs={6} sx={{ display: "flex", flexDirection: "column" }}>
                            <FormControlLabel
                                value="just-testing"
                                control={<Radio />}
                                label="Just testing it"
                            />
                            <FormControlLabel
                                value="does-not-fill-need"
                                control={<Radio />}
                                label="Does not fulfill my need"
                            />
                            <FormControlLabel
                                value="not-useful"
                                control={<Radio />}
                                label="Useless"
                            />
                        </Grid>
                    </Grid>
                </RadioGroup>
            </RadioGroup>
        </Box>
    );

    return (
        <>
            <ConfirmDialog
                open={open}
                onClose={onClose}
                title={`Cancel subscription`}
                content={renderPreviewContent}
                sx={{ px: 4 }}
                maxWidth="sm"
                action={
                    <>
                        <LoadingButton
                            onClick={onChangePlanClick}
                            loading={isSubmitting.value}
                            loadingPosition="end"
                            variant="contained"
                            color="error"
                        >
                            Cancel subscription
                        </LoadingButton>
                    </>
                }
            />
        </>
    );
}
