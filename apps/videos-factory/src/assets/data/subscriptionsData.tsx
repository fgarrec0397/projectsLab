import EssentialsPlanIcon from "@/assets/icons/essentials-plan-icon";
import FreePlanIcon from "@/assets/icons/free-plan-icon";
import GrowthPlanIcon from "@/assets/icons/growth-plan-icon";

export const subscriptionsData = {
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
            notSubscribed: "Upgrade to Essentials",
        },
    },
    Growth: {
        icon: <GrowthPlanIcon />,
        isBestDeal: true,
        buttonText: {
            loggedIn: "Switch to Growth",
            notLoggedIn: "Try Free",
            notSubscribed: "Upgrade to Growth",
        },
    },
};
