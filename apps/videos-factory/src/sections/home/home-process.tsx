"use client";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { alpha } from "@mui/material/styles";
import { m } from "framer-motion";

import { MotionViewport, varFade } from "@/components/animate";

import HomeProcessRow from "./home-process-row";

// ----------------------------------------------------------------------

const processes = [
    {
        title: "Define your target audience",
        subTitle: "Step 1",
        description: "Setup its location, language, etc. ",
        image: "/assets/images/home/step1.jpg",
    },
    {
        title: "Choose your content type",
        subTitle: "Step 2",
        description:
            "Define your topic, choose your video structure type, etc. You can also add custom specifications",
        image: "/assets/images/home/step2.jpg",
    },
    {
        title: "Select or upload your assets",
        subTitle: "Step 3",
        description: "Choose the perfect assets from your library that will be used in this video",
        image: "/assets/images/home/step3.jpg",
    },
    {
        title: "Render or save for later",
        subTitle: "Step 4",
        description: "Rendering your video will make it available for download once it is ready",
        image: "",
    },
];

export default function HomeProcess() {
    return (
        <Box
            sx={{
                py: { xs: 10, md: 15 },
            }}
        >
            <Container component={MotionViewport}>
                <m.div variants={varFade().in}>
                    <Typography variant="h2" sx={{ mb: 3, textAlign: "center" }}>
                        Our guided process make it easy
                    </Typography>
                </m.div>
                {processes.map((x, index) => (
                    <HomeProcessRow key={x.title} process={x} isReversed={index % 2 !== 1} />
                ))}
            </Container>
        </Box>
    );
}
