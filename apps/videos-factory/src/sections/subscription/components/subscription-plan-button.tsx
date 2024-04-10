import { CardProps } from "@mui/material/Card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import { PrimaryButton } from "@/components/button";
import { getCheckoutURL } from "@/services/subscriptionsService/subscriptionsService";
import { IPlan } from "@/types/billing";
// import { IPlanVariant } from "@/types/billing";

// ----------------------------------------------------------------------

type Props = CardProps & {
    plan: IPlan;
    currentPlan?: IPlan;
    isYearly?: boolean;
    embed?: boolean;
};

export default function SubscriptionPlanButton({ plan, currentPlan, isYearly }: Props) {
    const router = useRouter();
    const auth = useAuthContext();
    const [loading, setLoading] = useState(false);
    const isCurrent = plan.id === currentPlan?.id;

    const label = isCurrent ? "Your plan" : "Sign up";

    // Make sure Lemon.js is loaded, you need to enqueue the Lemon Squeezy SDK in your app first.
    useEffect(() => {
        if (typeof window.createLemonSqueezy === "function") {
            window.createLemonSqueezy();
        }
    }, []);

    const onClick = async () => {
        (window as any).Paddle.Checkout.open({
            customer: {
                email: auth.user?.email,
            },
            customData: {
                userId: auth.user?.id,
            },
            items: [
                {
                    priceId: isYearly ? plan.yearlyPriceId : plan.monthlyPriceId,
                    quantity: 1,
                },
            ],
        });
    };

    return (
        <PrimaryButton
            fullWidth
            size="large"
            variant="contained"
            onClick={onClick}
            // disabled={basic}
            // color={starter ? "primary" : "inherit"}
        >
            {"test"}
        </PrimaryButton>
    );
}
