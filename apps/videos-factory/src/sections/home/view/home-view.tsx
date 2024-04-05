"use client";

import Box from "@mui/material/Box";
import { useScroll } from "framer-motion";

import ScrollProgress from "@/components/scroll-progress";
import MainLayout from "@/layouts/main";

import HomeHero from "../home-hero";
import HomeMinimal from "../home-minimal";
import HomePricing from "../home-pricing";

// ----------------------------------------------------------------------

export default function HomeView() {
    const { scrollYProgress } = useScroll();

    return (
        <MainLayout>
            <ScrollProgress scrollYProgress={scrollYProgress} />

            <HomeHero />

            <Box
                sx={{
                    overflow: "hidden",
                    position: "relative",
                    bgcolor: "background.default",
                }}
            >
                <HomeMinimal />

                <HomePricing />
            </Box>
        </MainLayout>
    );
}
