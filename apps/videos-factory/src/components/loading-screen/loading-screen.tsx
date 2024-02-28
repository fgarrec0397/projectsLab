import Box, { BoxProps } from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

// ----------------------------------------------------------------------

export type LoadingScreenProps = BoxProps & {
    fullWidth?: boolean;
};

export default function LoadingScreen({ sx, fullWidth, ...other }: LoadingScreenProps) {
    return (
        <Box
            sx={{
                px: fullWidth ? 0 : 5,
                width: 1,
                flexGrow: 1,
                minHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...sx,
            }}
            {...other}
        >
            <LinearProgress color="inherit" sx={{ width: 1, maxWidth: fullWidth ? "100%" : 360 }} />
        </Box>
    );
}
