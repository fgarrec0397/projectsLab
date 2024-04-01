import { CardActions, CardContent, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { useMemo } from "react";

import EssentialsPlanIcon from "@/assets/icons/essentials-plan-icon";
import FreePlanIcon from "@/assets/icons/free-plan-icon";
import GrowthPlanIcon from "@/assets/icons/growth-plan-icon";
import Iconify from "@/components/iconify";
import { pxToRem } from "@/theme/typography";
import { IPlanVariant } from "@/types/billing";
import { getPrice } from "@/utils/lemon-squeezy";

import SubscriptionPlanButton from "./subscription-plan-button";
import SubscriptionPlanLabel from "./subscription-plan-label";

// ----------------------------------------------------------------------

type Props = {
    plan: IPlanVariant;
    index: number;
    isYearly: boolean;
};

const planDataMapping = {
    Free: {
        icon: <FreePlanIcon />,
    },
    Essentials: {
        icon: <EssentialsPlanIcon />,
        isPopular: true,
    },
    Growth: {
        icon: <GrowthPlanIcon />,
        isBestDeal: true,
    },
};

export default function SubscriptionPlanCard({ plan, isYearly }: Props) {
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const mappedPlanData = (planDataMapping as any)[plan.productName as any];
    const isPopular = mappedPlanData?.isPopular;
    const isBestDeal = mappedPlanData?.isBestDeal;

    const parsedDescription = useMemo(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(plan.description, "text/html");

        const description = doc.querySelector("p")?.textContent?.trim() || "";

        const featuresLists = Array.from(doc.querySelectorAll("ul")).map((ul) =>
            Array.from(ul.querySelectorAll("li p")).map((li) => li.textContent?.trim() || "")
        );

        return { description, featuresLists };
    }, [plan.description]);

    const renderPopularLabel = (isTopRight?: boolean) => (
        <SubscriptionPlanLabel
            text="POPULAR"
            icon="medal-ribbon-star"
            color="success"
            isTopRight={isTopRight}
        />
    );

    const renderBestDealLabel = (isTopRight?: boolean) => (
        <SubscriptionPlanLabel
            text="BEST DEAL"
            icon="crown-star"
            color="secondary"
            isTopRight={isTopRight}
        />
    );

    const renderIcon = (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ height: 48 }}>{mappedPlanData?.icon}</Box>

            {isPopular && !isTablet && renderPopularLabel()}
            {isBestDeal && !isTablet && renderBestDealLabel()}
        </Stack>
    );

    const renderSubscription = (
        <Stack spacing={1}>
            <Typography variant="h4" sx={{ textTransform: "capitalize", ...visuallyHidden }}>
                {plan.productName}
            </Typography>
            <Typography
                variant="subtitle2"
                minHeight={44}
                sx={{ my: 2, display: "flex", alignItems: "center" }}
            >
                {parsedDescription.description}
            </Typography>
        </Stack>
    );

    const renderPrice = (
        <Stack direction="row" flexWrap="wrap" alignItems="center" minHeight={78}>
            <Typography variant="h4">$</Typography>
            <Typography variant="h2">
                {isYearly ? getPrice(plan.price) / 12 : getPrice(plan.price)}
            </Typography>
            <Typography
                component="span"
                sx={{
                    alignSelf: "center",
                    color: "text.disabled",
                    ml: 1,
                    typography: "body2",
                }}
            >
                / month
            </Typography>
            {isYearly && (
                <Typography
                    component="span"
                    sx={{
                        alignSelf: "center",
                        color: "text.disabled",
                        typography: "body2",
                        ml: 2,
                        fontSize: pxToRem(12),
                    }}
                >
                    Billed annually
                </Typography>
            )}
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
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
            }}
        >
            <CardContent sx={{ p: { xs: 2, md: 4 }, pb: 2 }}>
                <Stack
                    spacing={4}
                    flexDirection={isTablet ? "row" : "column"}
                    sx={{ position: "relative" }}
                >
                    <Stack>
                        {renderIcon}

                        {renderSubscription}

                        {renderPrice}
                    </Stack>

                    {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

                    {renderLists}
                    {isPopular && isTablet && renderPopularLabel(true)}
                    {isBestDeal && isTablet && renderBestDealLabel(true)}
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 4 }}>
                <SubscriptionPlanButton plan={plan} />
            </CardActions>
        </Card>
    );
}
