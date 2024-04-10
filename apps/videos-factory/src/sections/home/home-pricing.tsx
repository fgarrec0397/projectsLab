"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";

import { MotionViewport, varFade } from "@/components/animate";
import SubscriptionPricinPlans from "@/sections/subscription/components/subscription-pricing-plans";
import { useGetPricingPlans } from "@/services/plansService/hooks/useGetPricingPlans";

// ----------------------------------------------------------------------

export default function HomePricing() {
    const { plans, isPlansLoading } = useGetPricingPlans();

    const renderDescription = (
        <Stack spacing={3} sx={{ mb: 10, textAlign: "center" }}>
            <m.div variants={varFade().inDown}>
                <Typography variant="h2">Early adopters pricing</Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
                <Typography sx={{ color: "text.secondary" }}>
                    Transparent and predictable prices to start gaining traction. No credit cards
                    required
                </Typography>
            </m.div>
        </Stack>
    );

    if (isPlansLoading) {
        return null;
    }

    return (
        <Box
            sx={{
                py: { xs: 10, md: 15 },
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            }}
        >
            <Container component={MotionViewport}>
                {renderDescription}
                <m.div variants={varFade().inLeft}>
                    <SubscriptionPricinPlans plans={plans} align="center" />
                </m.div>
            </Container>
        </Box>
    );
}
