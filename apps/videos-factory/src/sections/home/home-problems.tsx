import { CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";

import { MotionViewport, varFade } from "@/components/animate";

// ----------------------------------------------------------------------

const CARDS = [
    {
        icon: "/assets/icons/home/eyes.svg",
        title: "Seeing 0 viewers on your Google Analytics",
        description:
            "Having zero traffic is very frustrating. By automating your video creation you will be able to redirect that traffic toward your website",
    },
    {
        icon: "/assets/icons/home/money-with-wings.svg",
        title: "Paying money for extra tools",
        description:
            "There is a ton of UI tools for videos automation, but most of them require you to subscribe to multiple platform. Createify handle everything for you",
    },
    {
        icon: "/assets/icons/home/stopwatch.svg",
        title: "Loosing time making boring videos",
        description:
            "Not everyone has the skills or motivation to craft well made videos especially when you run a business. With Createify, tell us who will your video been viewed and we tackle the rest",
    },
];

// ----------------------------------------------------------------------

export default function HomeProblems() {
    return (
        <Container
            component={MotionViewport}
            sx={{
                py: { xs: 10, md: 15 },
            }}
        >
            <Stack
                spacing={3}
                sx={{
                    textAlign: "center",
                    mb: { xs: 5, md: 10 },
                }}
            >
                <m.div variants={varFade().inUp}>
                    <Typography component="div" variant="body1" sx={{ color: "text.disabled" }}>
                        By usign Createify
                    </Typography>
                </m.div>

                <m.div variants={varFade().inUp}>
                    <Typography variant="h2" sx={{ display: "inline-flex", alignItems: "center" }}>
                        <Box
                            component="img"
                            src="/assets/icons/home/stop-sign.svg"
                            alt="stop"
                            sx={{ mr: 1, width: 48, height: 48 }}
                        />
                        You will stop
                    </Typography>
                </m.div>
            </Stack>

            <Box
                gap={{ xs: 3, lg: 10 }}
                display="grid"
                alignItems="center"
                gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    md: "repeat(3, 1fr)",
                }}
            >
                {CARDS.map((card) => (
                    <m.div variants={varFade().inUp} key={card.title} style={{ height: "100%" }}>
                        <Card style={{ height: "100%" }}>
                            <CardContent>
                                <Stack alignItems="center" style={{ height: "100%" }}>
                                    <Box
                                        component="img"
                                        src={card.icon}
                                        alt={card.title}
                                        sx={{ mx: "auto", width: 48, height: 48 }}
                                    />

                                    <Typography
                                        variant="h5"
                                        sx={{ mt: 3, mb: 2, textAlign: "center" }}
                                    >
                                        {card.title}
                                    </Typography>

                                    <Typography
                                        sx={{ color: "text.secondary", textAlign: "center" }}
                                    >
                                        {card.description}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </m.div>
                ))}
            </Box>
        </Container>
    );
}
