import { ButtonBase } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";

import GoogleLogo from "@/assets/icons/google-logo";
import { pxToRem } from "@/theme/typography";

type Props = {
    onClick?: () => void;
};

export default function LoginWithGoogleButton({ onClick }: Props) {
    return (
        <ButtonBase
            onClick={onClick}
            sx={(theme) => ({
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.background.paper,
                border: "1px solid #d8d8d8",
                padding: `${pxToRem(15)} 0`,
                borderRadius: pxToRem(30),
                fontWeight: theme.typography.fontWeightBold,
                fontSize: theme.typography.fontSize,
                "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                },
            })}
        >
            <SvgIcon sx={{ marginRight: pxToRem(10), fontSize: 20 }}>
                <GoogleLogo />
            </SvgIcon>
            Continue with Google
        </ButtonBase>
    );
}
