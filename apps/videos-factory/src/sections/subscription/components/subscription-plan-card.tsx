import { CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import FreePlanIcon from "@/assets/icons/free-plan-icon";
import Iconify from "@/components/iconify";
import Label from "@/components/label";
import { IPlanVariant } from "@/types/billing";

import SubscriptionPlanButton from "./subscription-plan-button";

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
        isPopular: true,
    },
    Growth: {
        icon: <FreePlanIcon />,
        isAdvantaged: true,
    },
};

export default function SubscriptionPlanCard({ plan, isYearly, sx, ...other }: Props) {
    console.log(plan.description, "plan.description");

    const parsedDescription = useMemo(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(plan.description, "text/html");

        // Get the first paragraph's text
        const description = doc.querySelector("p")?.textContent?.trim() || "";

        // Get all the featuresLists
        const featuresLists = Array.from(doc.querySelectorAll("ul")).map((ul) =>
            Array.from(ul.querySelectorAll("li p")).map((li) => li.textContent?.trim() || "")
        );

        return { description, featuresLists };
    }, [plan.description]);

    console.log(parsedDescription);

    const renderIcon = (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ width: 48, height: 48 }}>
                {(planDataMapping as any)[plan.productName as any]?.icon}
            </Box>

            {(planDataMapping as any)[plan.productName as any]?.isPopular && (
                <Label color="info">POPULAR</Label>
            )}
        </Stack>
    );

    const renderSubscription = (
        <Stack spacing={1}>
            <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
                {plan.productName}
            </Typography>
            <Typography variant="subtitle2">{parsedDescription.description}</Typography>
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

    const renderLists = parsedDescription.featuresLists.map((list, index) => (
        <Stack key={index} spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box component="span" sx={{ typography: "overline" }}>
                    {index > 0 ? "Plus" : "Features"}
                </Box>
            </Stack>

            {list?.map((item) => (
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
    ));

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

                    {renderLists}

                    <SubscriptionPlanButton plan={plan} />
                </Stack>
            </CardContent>
        </Card>
    );
}
