import { CardActions, CardContent, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import EssentialsPlanIcon from "@/assets/icons/essentials-plan-icon";
import FreePlanIcon from "@/assets/icons/free-plan-icon";
import GrowthPlanIcon from "@/assets/icons/growth-plan-icon";
import { useAuthContext } from "@/auth/hooks";
import Iconify from "@/components/iconify";
import { pxToRem } from "@/theme/typography";
import { IPlan } from "@/types/billing";
import { IUser } from "@/types/user";
import { getPrice } from "@/utils/lemon-squeezy";

import SubscriptionPlanButton from "./subscription-plan-button";
import SubscriptionPlanLabel from "./subscription-plan-label";

// ----------------------------------------------------------------------

type Props = {
    plan: IPlan;
    index: number;
    isYearly: boolean;
    user?: IUser;
};

const planDataMapping = {
    Free: {
        icon: <FreePlanIcon />,
        buttonText: {
            loggedIn: "Cancel and Go Free",
            notLoggedIn: "Try Free",
            notSubscribed: "Get Free",
        },
    },
    Essentials: {
        icon: <EssentialsPlanIcon />,
        isPopular: true,
        buttonText: {
            loggedIn: "Switch to Essentials",
            notLoggedIn: "Try Free",
            notSubscribed: "Get Essentials",
        },
    },
    Growth: {
        icon: <GrowthPlanIcon />,
        isBestDeal: true,
        buttonText: {
            loggedIn: "Switch to Growth",
            notLoggedIn: "Try Free",
            notSubscribed: "Get Growth",
        },
    },
};

export default function SubscriptionPlanCard({ plan, isYearly, user }: Props) {
    const theme = useTheme();
    const { authenticated } = useAuthContext();
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const mappedPlanData = (planDataMapping as any)[plan.name as any];
    const isPopular = mappedPlanData?.isPopular;
    const isBestDeal = mappedPlanData?.isBestDeal;
    const featuresLists = [plan.features, plan.moreFeatures];
    const isCurrentPlan =
        user?.currentPlanId === plan.id || (plan.name === "Free" && user?.currentPlanId === "free");

    const renderIsCurrentLabel = (isTopRight?: boolean) => (
        <SubscriptionPlanLabel text="CURRENT PLAN" color="primary" isTopRight={isTopRight} />
    );

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

            {authenticated ? (
                isCurrentPlan && !isTablet && renderIsCurrentLabel()
            ) : (
                <>
                    {isPopular && !isTablet && renderPopularLabel()}
                    {isBestDeal && !isTablet && renderBestDealLabel()}
                </>
            )}
        </Stack>
    );

    const renderSubscription = (
        <Stack spacing={1}>
            <Typography variant="h4" sx={{ textTransform: "capitalize", ...visuallyHidden }}>
                {plan.name}
            </Typography>
            <Typography
                variant="subtitle2"
                minHeight={44}
                sx={{ my: 2, display: "flex", alignItems: "center" }}
            >
                {plan.subDescription}
            </Typography>
        </Stack>
    );

    const renderPrice = (
        <Stack direction="row" flexWrap="wrap" alignItems="center" minHeight={78}>
            <Typography variant="h4">$</Typography>
            <Typography variant="h2">
                {isYearly ? getPrice(plan.yearlyPrice) / 12 : getPrice(plan.monthlyPrice)}
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
                {isYearly ? "Billed yearly" : "Billed monthly"}
            </Typography>
        </Stack>
    );

    const renderLists = featuresLists.map((list, index) => (
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
                    sx={{
                        position: "relative",
                        color: isCurrentPlan ? "action.disabled" : undefined,
                    }}
                >
                    <Stack>
                        {renderIcon}

                        {renderSubscription}

                        {renderPrice}
                    </Stack>

                    {renderLists}
                    {/* {authenticated ? (
                        isCurrentPlan && !isTablet && renderIsCurrentLabel(true)
                    ) : (
                        <>
                            {isPopular && !isTablet && renderPopularLabel(true)}
                            {isBestDeal && !isTablet && renderBestDealLabel(true)}
                        </>
                    )} */}
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 4 }}>
                <SubscriptionPlanButton
                    plan={plan}
                    isYearly={isYearly}
                    isCurrentPlan={isCurrentPlan}
                    user={user}
                    text={
                        authenticated
                            ? user?.currentPlanId
                                ? mappedPlanData.buttonText.loggedIn
                                : mappedPlanData.buttonText.notSubscribed
                            : mappedPlanData.buttonText.notLoggedIn
                    }
                />
            </CardActions>
        </Card>
    );
}
