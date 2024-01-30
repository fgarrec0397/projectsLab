"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { EmailInboxIcon } from "@/assets/icons";
import Iconify from "@/components/iconify";
import { RouterLink } from "@/routes/components";
import { useSearchParams } from "@/routes/hooks";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

export default function FirebaseVerifyView() {
    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    const renderHead = (
        <>
            <EmailInboxIcon sx={{ mb: 5, height: 96 }} />

            <Typography variant="h3" sx={{ mb: 1 }}>
                Please check your email!
            </Typography>

            <Stack spacing={1} sx={{ color: "text.secondary", typography: "body2", mb: 5 }}>
                <Box component="span"> We have sent a confirmation link to</Box>
                <Box component="strong" sx={{ color: "text.primary" }}>
                    {email}
                </Box>
                <Box component="div">Please check your inbox/spam.</Box>
            </Stack>
        </>
    );

    return (
        <>
            {renderHead}

            <Button
                component={RouterLink}
                href={paths.auth.login}
                size="large"
                color="inherit"
                variant="contained"
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                sx={{ alignSelf: "center" }}
            >
                Return to sign in
            </Button>
        </>
    );
}
