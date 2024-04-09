import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";

import { useAuthContext } from "@/auth/hooks";
import Logo from "@/components/logo";
import { NavSectionVertical } from "@/components/nav-section";
import Scrollbar from "@/components/scrollbar";
import { useSettingsContext } from "@/components/settings";
import { useResponsive } from "@/hooks/use-responsive";
import { usePathname } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { pxToRem } from "@/theme/typography";

import NavToggleButton from "../common/nav-toggle-button";
import NavUpgrade from "../common/nav-upgrade";
import { NAV } from "../config-layout";
import { useNavData } from "./config-navigation";

// ----------------------------------------------------------------------

type Props = {
    openNav: boolean;
    onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
    const { user } = useAuthContext();

    const settings = useSettingsContext();

    const pathname = usePathname();

    const lgUp = useResponsive("up", "lg");

    const navData = useNavData();

    const isNavMini = settings.themeLayout === "mini";

    const showNavUpgrade = false;

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                "& .simplebar-content": {
                    height: 1,
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Logo
                sx={{ mt: 3, ml: 3, mb: 1 }}
                showSingleLogo={isNavMini}
                url={paths.dashboard.root}
            />

            <NavSectionVertical
                data={navData}
                slotProps={{
                    currentRole: user?.role,
                }}
                sx={{ marginTop: pxToRem(24) }}
            />

            <Box sx={{ flexGrow: 1 }} />

            {showNavUpgrade && <NavUpgrade />}
        </Scrollbar>
    );

    return (
        <Box
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV.W_VERTICAL },
            }}
        >
            <NavToggleButton />

            {lgUp ? (
                <Stack
                    sx={{
                        height: 1,
                        position: "fixed",
                        width: NAV.W_VERTICAL,
                        borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    {renderContent}
                </Stack>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    PaperProps={{
                        sx: {
                            width: NAV.W_VERTICAL,
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
