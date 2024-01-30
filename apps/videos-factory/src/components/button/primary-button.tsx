import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const PrimaryButton: FC<ButtonProps> = (props) => {
    return <Button {...props} variant="contained" color="primary" />;
};
