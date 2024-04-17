import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { subscriptionsData } from "@/assets/data/subscriptionsData";
import { useAuthContext } from "@/auth/hooks";
import { PrimaryButton } from "@/components/button";
import { paths } from "@/routes/paths";
import { useGetCurrentPlan } from "@/services/plansService/hooks/useGetCurrentPlan";
import { useGetCurrentUser } from "@/services/usersService/hooks/useGetCurrentUser";
import { pxToRem } from "@/theme/typography";

import UsageWidget from "./usage-widget";

// ----------------------------------------------------------------------

export default function NavUsage() {
    const { currentUser } = useGetCurrentUser();
    const { currentPlan } = useGetCurrentPlan();
    const mappedSubscriptionData = (subscriptionsData as any)[currentPlan?.name as any];

    if (!mappedSubscriptionData) {
        return;
    }

    return (
        <Stack
            sx={{
                px: 2,
                py: 5,
                textAlign: "center",
            }}
        >
            <Stack spacing={3} alignItems="center">
                <Stack spacing={4} sx={{ width: 1 }}>
                    <Stack spacing={2}>
                        <Typography variant="subtitle2" sx={{ fontSize: pxToRem(12) }}>
                            You are on
                        </Typography>
                        <Box sx={{ height: 40 }}>{mappedSubscriptionData?.icon}</Box>
                    </Stack>
                    <Stack>
                        <UsageWidget
                            value={currentUser?.usedVideos || 0}
                            total={currentUser?.allowedVideos || 0}
                            units="videos"
                            format="with-units"
                        />
                        <UsageWidget
                            value={currentUser?.usedStorage || 0}
                            total={currentUser?.allowedStorage || 0}
                            units="GB"
                            format="with-units"
                        />
                    </Stack>
                </Stack>

                <PrimaryButton variant="soft" href={paths.dashboard.subscription} rel="noopener">
                    Upgrade
                </PrimaryButton>
            </Stack>
        </Stack>
    );
}
