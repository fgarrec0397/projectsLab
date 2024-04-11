"use client";

import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Button, Paper, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";
// ----------------------------------------------------------------------
import * as React from "react";

import { MotionViewport, varFade } from "@/components/animate";
import Iconify from "@/components/iconify";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { icon } from "@/theme/icons";
import { pxToRem } from "@/theme/typography";

type RoadmapEvent = {
    name: string;
    description: string;
    color: string;
    icon: string;
    when: string;
};

type RoadmapTimelineProps = {
    events: RoadmapEvent[];
};

function RoadmapTimeline({ events }: RoadmapTimelineProps) {
    return (
        <Timeline sx={{ alignItems: "center" }}>
            {events.map((x, index) => (
                <m.div key={x.name} variants={varFade().inUp}>
                    <TimelineItem sx={{ maxWidth: pxToRem(780), mb: 2, alignItems: "center" }}>
                        <TimelineSeparator sx={{ alignSelf: "stretch" }}>
                            <TimelineDot
                                color={x.color as any}
                                sx={{ position: "relative", top: "calc(50% - 32px)" }}
                            >
                                {icon(x.icon)}
                            </TimelineDot>
                            {index < events.length - 1 && (
                                <TimelineConnector
                                    sx={{ position: "relative", top: "calc(50% - 23px)" }}
                                />
                            )}
                        </TimelineSeparator>
                        <TimelineOppositeContent sx={{ flex: 0.75, textAlign: "left" }}>
                            <Typography>{x.when}</Typography>
                        </TimelineOppositeContent>

                        <TimelineContent sx={{ flex: 3 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                }}
                            >
                                <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                                    {x.name}
                                </Typography>
                                <Typography>{x.description}</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                </m.div>
            ))}
        </Timeline>
    );
}

const events: RoadmapEvent[] = [
    {
        name: "Direct upload on social media",
        description:
            "We start by Youtube and Tiktok. If you want more social networks, there will be more",
        when: "Summer 2024",
        color: "warning",
        icon: "sun-2",
    },
    {
        name: "Channels",
        description:
            "Create a channel and set it up in auto-pilot. You will litterally create videos while sleeping",
        when: "Fall 2024",
        color: "error",
        icon: "leaf",
    },
    {
        name: "Automating assets",
        description:
            "No need to provide your assets anymore. You can still use yours, but you will be able to delegate this part to us",
        when: "Winter 2025",
        color: "info",
        icon: "snowflake",
    },
];

export default function HomeRoadmap() {
    return (
        <Box
            sx={{
                py: { xs: 10, md: 15 },
            }}
        >
            <Container component={MotionViewport}>
                <Stack spacing={2} sx={{ mb: 6 }}>
                    <m.div variants={varFade().inUp}>
                        <Typography variant="h2" sx={{ textAlign: "center" }}>
                            We are <br /> continually improving
                        </Typography>
                    </m.div>
                    <m.div variants={varFade().inUp}>
                        <Typography sx={{ textAlign: "center" }}>
                            Here is a basic roadmap of our next 3 big features
                        </Typography>
                    </m.div>
                </Stack>
                <RoadmapTimeline events={events} />
                <m.div variants={varFade().in}>
                    <Box
                        sx={{
                            textAlign: "center",
                            mt: {
                                xs: 5,
                                md: 10,
                            },
                        }}
                    >
                        <m.div variants={varFade().inUp}>
                            <Typography variant="h4" sx={{ mb: 3 }}>
                                Begin your journey with us
                            </Typography>
                        </m.div>

                        <m.div variants={varFade().inUp}>
                            <Button
                                component={RouterLink}
                                href={paths.auth.register}
                                color="inherit"
                                size="large"
                                variant="contained"
                                startIcon={<Iconify icon="eva:flash-fill" width={24} />}
                            >
                                Start automating videos
                            </Button>
                        </m.div>
                    </Box>
                </m.div>
            </Container>
        </Box>
    );
}
