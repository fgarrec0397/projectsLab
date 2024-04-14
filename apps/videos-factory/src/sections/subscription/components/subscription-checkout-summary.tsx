import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { fCurrency } from "@/utils/format-number";

// ----------------------------------------------------------------------

type Props = {
    total: number;
    credit?: number;
    taxes: number;
    totalWithTaxes: number;
    subTotal: number;
    frequency?: string;
    action: "charge" | "credit";
};

export default function SubscriptionCheckoutSummary({
    total,
    credit,
    taxes,
    totalWithTaxes,
    subTotal,
    frequency,
    action,
}: Props) {
    return (
        <>
            <Stack spacing={2}>
                <Typography variant="subtitle1" component="p">
                    Amount charged
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Sub Total
                    </Typography>
                    <Typography variant="subtitle2">{fCurrency(subTotal)}</Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Taxes
                    </Typography>
                    <Typography variant="subtitle2">{fCurrency(taxes)}</Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Total with taxes
                    </Typography>
                    <Typography variant="subtitle2">{fCurrency(totalWithTaxes)}</Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />

                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Credit</Typography>
                    <Typography variant="subtitle2" sx={{ color: "success.dark" }}>
                        {credit ? fCurrency(-credit) : "-"}
                    </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />

                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1">Total</Typography>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: action === "credit" ? "success.dark" : undefined }}
                        >
                            {fCurrency(total)}
                        </Typography>
                        {frequency !== undefined && (
                            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                                {action === "charge" && (
                                    <>
                                        Pay {fCurrency(total)} now, then {fCurrency(totalWithTaxes)}{" "}
                                        each {frequency}
                                    </>
                                )}
                                {action === "credit" && (
                                    <>
                                        {fCurrency(total)} is credited to your account <br />
                                        Then, you will pay {fCurrency(totalWithTaxes)} each{" "}
                                        {frequency}
                                    </>
                                )}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Stack>
        </>
    );
}
