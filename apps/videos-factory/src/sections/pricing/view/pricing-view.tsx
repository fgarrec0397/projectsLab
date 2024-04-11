"use client";

import { Container } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";

import { varFade } from "@/components/animate";
import SubscriptionPricinPlans from "@/sections/subscription/components/subscription-pricing-plans";
import { useGetPricingPlans } from "@/services/plansService/hooks/useGetPricingPlans";

// ----------------------------------------------------------------------

export default function PricingView() {
    const { plans, isPlansLoading } = useGetPricingPlans();

    const renderDescription = (
        <Stack spacing={3} sx={{ mb: 10, textAlign: "center" }}>
            <m.div variants={varFade().inUp}>
                <Typography variant="h2" component="h1">
                    Early adopters pricing
                </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
                <Typography sx={{ color: "text.secondary" }}>
                    <strong>Transparent</strong> and <strong>predictable</strong> prices to start
                    gaining traction.
                    <br />
                    <i>No credit cards required</i>
                </Typography>
            </m.div>
        </Stack>
    );

    if (isPlansLoading) {
        return null;
    }
    return (
        <Container sx={{ py: 10 }}>
            {renderDescription}
            <m.div variants={varFade().inUp}>
                <SubscriptionPricinPlans plans={plans} align="center" />
            </m.div>
        </Container>
    );
}
