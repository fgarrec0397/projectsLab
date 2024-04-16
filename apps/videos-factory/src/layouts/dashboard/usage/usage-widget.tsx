import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

import { fData } from "@/utils/format-number";

// ----------------------------------------------------------------------

interface Props {
    value: number;
    total: number;
    units?: string;
}

export default function UsageWidget({ value, total, units }: Props) {
    return (
        <Stack sx={{ px: 3 }}>
            <Stack direction="row" sx={{ typography: "caption", fontWeight: "bold" }}>
                <Box
                    sx={{
                        mr: 0.5,
                        typography: "caption",
                    }}
                >
                    {fData(value, units)}
                </Box>

                {` / ${fData(total, units)}`}
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
