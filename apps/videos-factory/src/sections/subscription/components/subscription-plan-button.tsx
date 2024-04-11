import { CardProps } from "@mui/material/Card";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/auth/hooks";
import { PrimaryButton } from "@/components/button";
import { paths } from "@/routes/paths";
import { IPlan } from "@/types/billing";

// ----------------------------------------------------------------------

type Props = CardProps & {
    plan: IPlan;
    isYearly?: boolean;
    isCurrentPlan?: boolean;
    text: string;
};

export default function SubscriptionPlanButton({ plan, isYearly, isCurrentPlan, text }: Props) {
    const router = useRouter();
    const { authenticated, user } = useAuthContext();

    const buttonText = isCurrentPlan ? "Current plan" : text;

    const onClick = async () => {
        if (!authenticated) {
            return router.push(paths.auth.register);
        }

        (window as any).Paddle.Checkout.open({
            customer: {
                email: user?.email,
            },
            customData: {
                userId: user?.id,
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
            disabled={isCurrentPlan}
        >
            {buttonText}
        </PrimaryButton>
    );
}
