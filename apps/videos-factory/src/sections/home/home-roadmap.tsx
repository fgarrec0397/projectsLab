"use client";

import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Paper, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";
// ----------------------------------------------------------------------
import * as React from "react";

import { MotionViewport, varFade } from "@/components/animate";
import { icon } from "@/theme/icons";

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
        <Timeline position="alternate">
            {events.map((x) => (
                <TimelineItem key={x.name} sx={{ mb: 2 }}>
                    <TimelineOppositeContent>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {x.when}
                        </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot>{icon(x.icon)}</TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper
                            sx={{
                                p: 3,
                                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                            }}
                        >
                            <Typography variant="h4" component="span" sx={{ mb: 1 }}>
                                {x.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                {x.description}
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
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
        color: "default",
        icon: "sun-2",
    },
    {
        name: "Channels",
        description:
            "Create a channel and set it up in auto-pilot. You will litterally create videos while sleeping",
        when: "Fall 2024",
        color: "default",
        icon: "leaf",
    },
    {
        name: "Automating assets",
        description:
            "No need to provide your assets anymore. You can still use yours, but you will be able to delegate this part to us",
        when: "Winter 2025",
        color: "default",
        icon: "snowflake",
    },
];

export default function HomeRoadmap() {
    return (
        <Box
            sx={{
                py: { xs: 10, md: 15 },
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            }}
        >
            <Container component={MotionViewport}>
                <Stack spacing={2} sx={{ mb: 6 }}>
                    <m.div variants={varFade().inUp}>
                        <Typography variant="h2" sx={{ textAlign: "center" }}>
                            We are continually improving
                        </Typography>
                    </m.div>
                    <m.div variants={varFade().inUp}>
                        <Typography sx={{ textAlign: "center" }}>
                            Here is a basic roadmap of our next 3 big features
                        </Typography>
                    </m.div>
                </Stack>
                <m.div variants={varFade({ durationIn: 3 }).in}>
                    <RoadmapTimeline events={events} />
                </m.div>
            </Container>
        </Box>
    );
}
