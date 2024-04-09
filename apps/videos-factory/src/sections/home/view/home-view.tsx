"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useScroll } from "framer-motion";

import ScrollProgress from "@/components/scroll-progress";
import MainLayout from "@/layouts/main";

import HomeFilesManagerShowcase from "../home-files-manager-showcase";
import HomeHero from "../home-hero";
import HomePricing from "../home-pricing";
import HomePromblems from "../home-problems";
import HomeProcess from "../home-process";
import HomeRoadmap from "../home-roadmap";

// ----------------------------------------------------------------------

type StyledPolygonProps = {
    anchor?: "top" | "bottom";
};

const StyledPolygon = styled("div")<StyledPolygonProps>(({ anchor = "top", theme }) => ({
    left: 0,
    zIndex: 9,
    height: 80,
    width: "100%",
    position: "absolute",
    clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
    backgroundColor: theme.palette.background.default,
    display: "block",
    lineHeight: 0,
    ...(anchor === "top" && {
        top: -1,
        transform: "scale(-1, -1)",
    }),
    ...(anchor === "bottom" && {
        bottom: -1,
        // backgroundColor: theme.palette.grey[900],
    }),
}));

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

                <Box sx={{ position: "relative" }}>
                    <StyledPolygon />
                    <HomeFilesManagerShowcase />
                    <StyledPolygon anchor="bottom" />
                </Box>
                <HomeRoadmap />
                <HomePricing />
            </Box>
        </MainLayout>
    );
}
