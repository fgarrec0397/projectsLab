import { CardProps } from "@mui/material/Card";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/auth/hooks";
import { PrimaryButton } from "@/components/button";
import { useBoolean } from "@/hooks/use-boolean";
import { paths } from "@/routes/paths";
import { IPlan } from "@/types/billing";
import { IUser } from "@/types/user";

import SubscriptionPlanCancelDialog from "./subscription-plan-cancel-dialog";
import SubscriptionPlanUpdateDialog from "./subscription-plan-update-dialog";

// ----------------------------------------------------------------------

type Props = CardProps & {
    plan: IPlan;
    isYearly?: boolean;
    isCurrentPlan?: boolean;
    text: string;
    user?: IUser;
};

export default function SubscriptionPlanButton({
    plan,
    isYearly,
    isCurrentPlan,
    text,
    user,
}: Props) {
    const router = useRouter();
    const isPreviewOpened = useBoolean();
    const isCancelOpened = useBoolean();
    const { authenticated } = useAuthContext();
    const isAlreadyOnPaidPlan = user?.currentPlanId !== "free";
    const priceId = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId;

    const buttonText = isCurrentPlan ? "Current plan" : text;

    const onClick = async () => {
        if (!authenticated) {
            return router.push(paths.auth.register);
        }

        if (isAlreadyOnPaidPlan && plan.name === "Free") {
            isCancelOpened.onTrue();
            return;
        }

        if (isAlreadyOnPaidPlan) {
            isPreviewOpened.onTrue();
            return;
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
                    priceId,
                    quantity: 1,
                },
            ],
        });
    };

    return (
        <>
            <PrimaryButton
                fullWidth
                size="large"
                variant="contained"
                onClick={onClick}
                disabled={isCurrentPlan}
            >
                {buttonText}
            </PrimaryButton>
            {isPreviewOpened.value && (
                <SubscriptionPlanUpdateDialog
                    plan={plan}
                    open={isPreviewOpened.value}
                    onClose={isPreviewOpened.onFalse}
                />
            )}
            {isCancelOpened.value && (
                <SubscriptionPlanCancelDialog
                    plan={plan}
                    open={isCancelOpened.value}
                    onClose={isCancelOpened.onFalse}
                />
            )}
        </>
    );
}
