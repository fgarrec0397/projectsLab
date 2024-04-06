import AppBar from "@mui/material/AppBar";
import Badge, { badgeClasses } from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";

import { PrimaryButton } from "@/components/button";
import Label from "@/components/label";
import Logo from "@/components/logo";
import { useOffSetTop } from "@/hooks/use-off-set-top";
import { useResponsive } from "@/hooks/use-responsive";
import { paths } from "@/routes/paths";
import { bgBlur } from "@/theme/css";

import HeaderShadow from "../common/header-shadow";
import LoginButton from "../common/login-button";
import { HEADER } from "../config-layout";
import { navConfig } from "./config-navigation";
import NavDesktop from "./nav/desktop";
import NavMobile from "./nav/mobile";

// ----------------------------------------------------------------------

export default function Header() {
    const theme = useTheme();

    const mdUp = useResponsive("up", "md");

    const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

    return (
        <AppBar>
            <Toolbar
                disableGutters
                sx={{
                    height: {
                        xs: HEADER.H_MOBILE,
                        md: HEADER.H_DESKTOP,
                    },
                    transition: theme.transitions.create(["height"], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.shorter,
                    }),
                    ...(offsetTop && {
                        ...bgBlur({
                            color: theme.palette.background.default,
                        }),
                        height: {
                            md: HEADER.H_DESKTOP_OFFSET,
                        },
                    }),
                }}
            >
                <Container sx={{ height: 1, display: "flex", alignItems: "center" }}>
                    <Badge
                        sx={{
                            [`& .${badgeClasses.badge}`]: {
                                top: 8,
                                right: -16,
                            },
                        }}
                        badgeContent={
                            <Label
                                color="info"
                                sx={{ textTransform: "unset", height: 22, px: 0.5 }}
                            >
                                BETA
                            </Label>
                        }
                    >
                        <Logo />
                    </Badge>

                    <Box sx={{ flexGrow: 1 }} />

                    {mdUp && <NavDesktop data={navConfig} />}

                    <Stack alignItems="center" direction={{ xs: "row", md: "row-reverse" }}>
                        <PrimaryButton href={paths.auth.register}>Try free</PrimaryButton>

                        {mdUp && <LoginButton />}

                        {!mdUp && <NavMobile data={navConfig} />}
                    </Stack>
                </Container>
            </Toolbar>

            {offsetTop && <HeaderShadow />}
        </AppBar>
    );
}
