"use client";

import { Container, IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";
import { useRouter } from "next/navigation";

import { varFade } from "@/components/animate";
import Iconify from "@/components/iconify";
import Logo from "@/components/logo";
import SubscriptionPricinPlans from "@/sections/subscription/components/subscription-pricing-plans";
import { useGetPricingPlans } from "@/services/plansService/hooks/useGetPricingPlans";

// ----------------------------------------------------------------------

export default function PricingView() {
    const router = useRouter();
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
        <Container sx={{ height: "100vh", py: 10 }}>
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 3 }}
            >
                <IconButton onClick={router.back} sx={{ mr: 1 }}>
                    <Iconify icon="eva:arrow-ios-back-fill" />
                </IconButton>
                <Logo />
            </Stack>
            {renderDescription}
            <m.div variants={varFade().inUp}>
                <SubscriptionPricinPlans plans={plans} align="center" />
            </m.div>
        </Container>
    );
}
