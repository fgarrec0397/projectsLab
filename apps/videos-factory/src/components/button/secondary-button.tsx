import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const SecondaryButton: FC<ButtonProps> = (props) => {
    return <Button {...props} variant="contained" color="secondary" />;
};
