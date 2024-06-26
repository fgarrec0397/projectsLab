import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const TertiaryButton: FC<ButtonProps> = (props) => {
    return <Button variant="outlined" {...props} />;
};
