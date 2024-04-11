import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";

import Logo from "@/components/logo";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

const LINKS = [
    {
        headline: "Createify",
        children: [
            { name: "About us", href: paths.about },
            { name: "FAQs", href: paths.faqs },
        ],
    },
    {
        headline: "Legal",
        children: [
            { name: "Terms and Condition", href: paths.termsAndConditions },
            { name: "Privacy Policy", href: paths.privacyPolicy },
        ],
    },
    {
        headline: "Contact",
        children: [{ name: "info@createify.io", href: "mailto:info@createify.io" }],
    },
];

// ----------------------------------------------------------------------

export default function Footer() {
    return (
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
                            Automate your video creation process with Createify. No need to ever
                            think about video editing and audience growing again
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
                                            target="_blank"
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
                    © 2024. All rights reserved
                </Typography>
            </Container>
        </Box>
    );
}
