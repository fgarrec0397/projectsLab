import Label, { LabelColor } from "@/components/label";
import { icon as themeIcon } from "@/theme/icons";
import { pxToRem } from "@/theme/typography";

// ----------------------------------------------------------------------

type Props = {
    text: string;
    icon: string;
    color?: LabelColor;
    isTopRight?: boolean;
};

export default function SubscriptionPlanLabel({ text, icon, isTopRight, color = "info" }: Props) {
    return (
        <Label
            color={color}
            startIcon={themeIcon(icon)}
            sx={isTopRight ? { position: "absolute", right: 0, top: pxToRem(-10) } : {}}
        >
            {text}
        </Label>
    );
}
