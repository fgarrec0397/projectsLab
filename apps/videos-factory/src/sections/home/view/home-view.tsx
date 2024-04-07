"use client";

import Box from "@mui/material/Box";
import { useScroll } from "framer-motion";

import ScrollProgress from "@/components/scroll-progress";
import MainLayout from "@/layouts/main";

import HomeHero from "../home-hero";
import HomePricing from "../home-pricing";
import HomePromblems from "../home-problems";
import HomeProcess from "../home-process";

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
                <HomePromblems />

                <HomeProcess />
                {/* <HomePricing /> */}
            </Box>
        </MainLayout>
    );
}
