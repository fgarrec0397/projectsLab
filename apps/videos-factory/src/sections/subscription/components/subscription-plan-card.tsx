import { CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import FreePlanIcon from "@/assets/icons/free-plan-icon";
import { PrimaryButton } from "@/components/button";
import Iconify from "@/components/iconify";
import Label from "@/components/label";
import { IPlanVariant } from "@/types/billing";

// ----------------------------------------------------------------------

type Props = CardProps & {
    plan: IPlanVariant;
    index: number;
    isYearly: boolean;
};

const planDataMapping = {
    Free: {
        icon: <FreePlanIcon />,
    },
    Essentials: {
        icon: <FreePlanIcon />,
    },
    Growth: {
        icon: <FreePlanIcon />,
    },
};

export default function SubscriptionPlanCard({ plan, isYearly, sx, ...other }: Props) {
    console.log(plan, "plan");

    const lists = ["item 1", "item 2", "item 3", "item 4", "item 5"];
    const renderIcon = (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ width: 48, height: 48 }}>
                {(planDataMapping as any)[plan.productName as any]?.icon}
            </Box>

            {<Label color="info">POPULAR</Label>}
        </Stack>
    );

    const renderSubscription = (
        <Stack spacing={1}>
            <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
                subscription
            </Typography>
            <Typography variant="subtitle2">Caption</Typography>
        </Stack>
    );

    const renderPrice = (
        <Stack direction="row">
            <Typography variant="h4">$</Typography>
            <Typography variant="h2">{Number(plan.price) / 100}</Typography>
            <Typography
                component="span"
                sx={{
                    alignSelf: "center",
                    color: "text.disabled",
                    ml: 1,
                    typography: "body2",
                }}
            >
                / {isYearly ? "year" : "month"}
            </Typography>
        </Stack>
    );

    const renderList = (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box component="span" sx={{ typography: "overline" }}>
                    Features
                </Box>
            </Stack>

            {lists.map((item) => (
                <Stack
                    key={item}
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{
                        typography: "body2",
                    }}
                >
                    <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
                    {item}
                </Stack>
            ))}
        </Stack>
    );

    return (
        <Card>
            <CardContent>
                <Stack
                    spacing={5}
                    sx={{
                        p: 5,
                        borderRadius: 2,
                        boxShadow: (theme) => ({
                            xs: theme.customShadows.card,
                            md: "none",
                        }),
                        ...sx,
                    }}
                    {...other}
                >
                    {renderIcon}

                    {renderSubscription}

                    {renderPrice}

                    <Divider sx={{ borderStyle: "dashed" }} />

                    {renderList}

                    <PrimaryButton
                        fullWidth
                        size="large"
                        variant="contained"
                        // disabled={basic}
                        // color={starter ? "primary" : "inherit"}
                    >
                        {"test"}
                    </PrimaryButton>
                </Stack>
            </CardContent>
        </Card>
    );
}
