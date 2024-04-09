"use client";

import { Stack, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { m } from "framer-motion";

import { varFade } from "@/components/animate";

import FaqsList from "../faq-list";

// ----------------------------------------------------------------------

export default function FaqView() {
    const renderDescription = (
        <Stack spacing={3} sx={{ mb: 10, textAlign: "center" }}>
            <m.div variants={varFade().inUp}>
                <Typography variant="h2" component="h1">
                    Frequently Asked Questions
                </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
                <Typography sx={{ color: "text.secondary" }}>
                    Transparent and predictable prices to start gaining traction. No credit cards
                    required
                </Typography>
            </m.div>
        </Stack>
    );

    return (
        <>
            <Container
                sx={{
                    pb: 10,
                    pt: { xs: 10, md: 15 },
                    position: "relative",
                }}
            >
                {renderDescription}
                <FaqsList />
            </Container>
        </>
    );
}
