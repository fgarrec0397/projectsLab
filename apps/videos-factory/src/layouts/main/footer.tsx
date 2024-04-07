import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import Logo from "@/components/logo";
import { RouterLink } from "@/routes/components";
import { usePathname } from "@/routes/hooks";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

const LINKS = [
    {
        headline: "Minimal",
        children: [
            { name: "About us", href: paths.about },
            { name: "FAQs", href: paths.faqs },
        ],
    },
    {
        headline: "Legal",
        children: [
            { name: "Terms and Condition", href: "#" },
            { name: "Privacy Policy", href: "#" },
        ],
    },
    {
        headline: "Contact",
        children: [{ name: "support@minimals.cc", href: "#" }],
    },
];

// ----------------------------------------------------------------------

export default function Footer() {
    const pathname = usePathname();

    const homePage = pathname === "/";

    const simpleFooter = (
        <Box
            component="footer"
            sx={{
                py: 5,
                textAlign: "center",
                position: "relative",
                bgcolor: "background.default",
            }}
        >
            <Container>
                <Logo sx={{ mb: 1, mx: "auto" }} />

                <Typography variant="caption" component="div">
                    © All rights reserved
                    <br /> made by
                    <Link href="https://minimals.cc/"> minimals.cc </Link>
                </Typography>
            </Container>
        </Box>
    );

    const mainFooter = (
        <Box
            component="footer"
            sx={{
                position: "relative",
                bgcolor: "background.default",
            }}
        >
            <Divider />

            <Container
                sx={{
                    pt: 10,
                    pb: 5,
                    textAlign: { xs: "center", md: "unset" },
                }}
            >
                <Logo sx={{ mb: 3 }} />

                <Grid
                    container
                    justifyContent={{
                        xs: "center",
                        md: "space-between",
                    }}
                >
                    <Grid xs={8} md={3}>
                        <Typography
                            variant="body2"
                            sx={{
                                maxWidth: 270,
                                mx: { xs: "auto", md: "unset" },
                            }}
                        >
                            The starting point for your next project with Minimal UI Kit, built on
                            the newest version of Material-UI ©, ready to be customized to your
                            style.
                        </Typography>
                    </Grid>

                    <Grid xs={12} md={6}>
                        <Stack spacing={5} direction={{ xs: "column", md: "row" }}>
                            {LINKS.map((list) => (
                                <Stack
                                    key={list.headline}
                                    spacing={2}
                                    alignItems={{ xs: "center", md: "flex-start" }}
                                    sx={{ width: 1 }}
                                >
                                    <Typography component="div" variant="overline">
                                        {list.headline}
                                    </Typography>

                                    {list.children.map((link) => (
                                        <Link
                                            key={link.name}
                                            component={RouterLink}
                                            href={link.href}
                                            color="inherit"
                                            variant="body2"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                <Typography variant="body2" sx={{ mt: 10 }}>
                    © 2021. All rights reserved
                </Typography>
            </Container>
        </Box>
    );

    return homePage ? simpleFooter : mainFooter;
}