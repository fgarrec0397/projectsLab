import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { forwardRef } from "react";

import { StyledLabel } from "./styles";
import { LabelProps } from "./types";

// ----------------------------------------------------------------------

const Label = forwardRef<HTMLSpanElement, LabelProps>(
    (
        {
            children,
            color = "default",
            variant = "soft",
            startIcon,
            endIcon,
            sx,
            size = "small",
            ...other
        },
        ref
    ) => {
        const theme = useTheme();

        const mappedIconSize = {
            small: {
                width: 16,
                height: 16,
            },
            medium: {
                width: 20,
                height: 20,
            },
            large: {
                width: 24,
                height: 24,
            },
        };

        const iconStyles = {
            width: mappedIconSize[size].width,
            height: mappedIconSize[size].height,
            "& svg, img": { width: 1, height: 1, objectFit: "cover" },
        };

        return (
            <StyledLabel
                ref={ref}
                component="span"
                ownerState={{ color, variant, size }}
                sx={{
                    ...(startIcon && { pl: 0.75 }),
                    ...(endIcon && { pr: 0.75 }),
                    ...sx,
                }}
                theme={theme}
                {...other}
            >
                {startIcon && <Box sx={{ mr: 0.75, ...iconStyles }}> {startIcon} </Box>}

                {children}

                {endIcon && <Box sx={{ ml: 0.75, ...iconStyles }}> {endIcon} </Box>}
            </StyledLabel>
        );
    }
);

Label.displayName = "Label";

export default Label;
