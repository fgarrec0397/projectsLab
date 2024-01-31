import Box, { BoxProps } from "@mui/material/Box";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import { forwardRef } from "react";

import { RouterLink } from "@/routes/components";

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
    disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
    ({ disabledLink = false, sx, ...other }, ref) => {
        const theme = useTheme();

        const PRIMARY_LIGHT = theme.palette.primary.light;

        const PRIMARY_MAIN = theme.palette.primary.main;

        const PRIMARY_DARK = theme.palette.primary.dark;

        const PRIMARY_DARKER = theme.palette.primary.darker;

        const logo = (
            <Box
                ref={ref}
                component="div"
                sx={{
                    width: 40,
                    height: 40,
                    display: "inline-flex",
                    ...sx,
                }}
                {...other}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 163 181"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M113.701 49.5349C107.358 46.4861 100.139 44.747 92.361 44.747C65.1358 44.747 44.7677 66.0511 44.7677 90.257C44.7677 114.463 65.1358 135.767 92.361 135.767C104.686 135.767 115.606 131.401 123.867 124.376L162.365 149.111C145.428 168.317 120.348 180.476 92.361 180.476C41.3513 180.476 0 140.084 0 90.257C0 40.4304 41.3513 0.0378418 92.361 0.0378418C113.501 0.0378418 132.983 6.97577 148.549 18.6478L113.701 49.5349Z"
                        fill={PRIMARY_LIGHT}
                    />
                    <path
                        d="M20.8968 67.9824C16.5644 56.8051 16.5644 44.9067 19.0912 35.1716C31.0052 16.0621 46.8902 7.40869 67.8299 3.08203C59.1652 13.1776 51.5842 48.1517 48.696 71.588C48.696 71.588 42.1975 86.7314 46.5298 102.235C22.7019 79.8808 20.8968 67.9824 20.8968 67.9824Z"
                        fill={PRIMARY_MAIN}
                    />
                    <path
                        d="M78.6615 46.7095C83.7159 35.8928 101.045 12.8171 127.039 6.6876C115.847 0.918729 88.0482 -3.04749 67.8308 3.082C55.9166 10.6538 39.6701 20.0283 40.7534 62.9346C40.7534 62.9346 41.8365 75.1936 45.8078 80.2414C48.335 71.2275 50.5013 68.7036 50.5013 68.7036C57.7219 56.084 69.2749 49.594 78.6615 46.7095Z"
                        fill={PRIMARY_DARK}
                    />
                    <path
                        d="M67.8757 51.3968C75.4576 32.2873 104.848 6.01157 117.123 3.1272C134.734 7.85948 148.701 18.5864 148.701 18.5864L113.681 49.5944C96.7128 43.4646 86.2884 44.5459 67.8757 51.3968Z"
                        fill={PRIMARY_DARKER}
                    />
                </svg>
            </Box>
        );

        if (disabledLink) {
            return logo;
        }

        return (
            <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
                {logo}
            </Link>
        );
    }
);

Logo.displayName = "Logo";

export default Logo;
