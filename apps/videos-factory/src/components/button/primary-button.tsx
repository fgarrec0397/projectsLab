import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const PrimaryButton: FC<ButtonProps> = (props) => {
    return <Button variant="contained" color="primary" {...props} />;
};
