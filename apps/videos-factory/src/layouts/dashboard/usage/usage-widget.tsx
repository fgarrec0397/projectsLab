import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

import { fData } from "@/utils/format-number";

// ----------------------------------------------------------------------

interface Props {
    value: number;
    total: number;
    units?: string;
    format?: "data" | "with-units";
}

export default function UsageWidget({ value, total, units, format = "data" }: Props) {
    const formatValue = (valueToFormat: number) => {
        if (format === "data") {
            return fData(valueToFormat);
        }

        if (format === "with-units") {
            return `${valueToFormat} ${units}`;
        }

        return `${valueToFormat}`;
    };

    return (
        <Stack sx={{ px: 3 }}>
            <Stack direction="row" sx={{ typography: "caption", fontWeight: "bold" }}>
                <Box
                    sx={{
                        mr: 0.5,
                        typography: "caption",
                    }}
                >
                    {formatValue(value)}
                </Box>

                {` / ${formatValue(total)}`}
            </Stack>
            <LinearProgress
                value={(value / total) * 100}
                variant="determinate"
                color="inherit"
                sx={{
                    my: 1,
                    height: 6,
                    "&:before": {
                        bgcolor: "divider",
                        opacity: 1,
                    },
                }}
            />
        </Stack>
    );
}
