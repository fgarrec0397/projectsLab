import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { alpha, styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { m, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Slider from "react-slick";

import { MotionContainer, varFade } from "@/components/animate";
import Carousel from "@/components/carousel";
import Iconify from "@/components/iconify";
import { useResponsive } from "@/hooks/use-responsive";
import { HEADER } from "@/layouts/config-layout";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { bgBlur, bgGradient, textGradient } from "@/theme/css";
import { pxToRem } from "@/theme/typography";

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
    ...bgGradient({
        color: alpha(theme.palette.background.default, theme.palette.mode === "light" ? 0.9 : 0.94),
        imgUrl: "/assets/background/overlay_3.jpg",
    }),
    width: "100%",
    height: "100vh",
    position: "relative",
    [theme.breakpoints.up("md")]: {
        top: 0,
        left: 0,
        position: "fixed",
    },
}));

const StyledWrapper = styled("div")(({ theme }) => ({
    height: "100%",
    overflow: "hidden",
    position: "relative",
    [theme.breakpoints.up("md")]: {
        marginTop: HEADER.H_DESKTOP_OFFSET,
    },
}));

const StyledTextGradient = styled(m.span)(({ theme }) => ({
    ...textGradient(
        `300deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.darker} 25%, ${theme.palette.primary.lighter} 50%, ${theme.palette.primary.darker} 75%, ${theme.palette.primary.lighter} 100%`
    ),
    padding: 0,
    marginTop: 8,
    lineHeight: 1,
    marginBottom: 24,
    textAlign: "center",
    backgroundSize: "400%",
    fontSize: "inherit",
    fontWeight: 900,
    fontFamily: theme.typography.fontSecondaryFamily,
}));

const StyledEllipseTop = styled("div")(({ theme }) => ({
    top: -80,
    width: 480,
    right: -80,
    height: 480,
    borderRadius: "50%",
    position: "absolute",
    filter: "blur(100px)",
    WebkitFilter: "blur(100px)",
    backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled("div")(({ theme }) => ({
    height: 400,
    bottom: -200,
    left: "10%",
    right: "10%",
    borderRadius: "50%",
    position: "absolute",
    filter: "blur(100px)",
    WebkitFilter: "blur(100px)",
    backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

type StyledPolygonProps = {
    opacity?: number;
    anchor?: "left" | "right";
};

const StyledPolygon = styled("div")<StyledPolygonProps>(
    ({ opacity = 1, anchor = "left", theme }) => ({
        ...bgBlur({
            opacity,
            color: theme.palette.background.default,
        }),
        zIndex: 9,
        bottom: 0,
        height: 80,
        width: "50%",
        position: "absolute",
        clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
        ...(anchor === "left" && {
            left: 0,
            ...(theme.direction === "rtl" && {
                transform: "scale(-1, 1)",
            }),
        }),
        ...(anchor === "right" && {
            right: 0,
            transform: "scaleX(-1)",
            ...(theme.direction === "rtl" && {
                transform: "scaleX(1)",
            }),
        }),
    })
);

// ----------------------------------------------------------------------

export default function HomeHero() {
    const smUp = useResponsive("up", "sm");

    const theme = useTheme();

    const heroRef = useRef<HTMLDivElement | null>(null);

    const { scrollY } = useScroll();

    const [percent, setPercent] = useState(0);

    const lightMode = theme.palette.mode === "light";
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 2,
        // slidesToScroll: 1,
        autoplay: true,
        speed: 10000,
        autoplaySpeed: 0,
        cssEase: "linear",
        vertical: true,
    };

    const getScroll = useCallback(() => {
        let heroHeight = 0;

        if (heroRef.current) {
            heroHeight = heroRef.current.offsetHeight;
        }

        scrollY.on("change", (scrollHeight) => {
            const scrollPercent = (scrollHeight * 100) / heroHeight;

            setPercent(Math.floor(scrollPercent));
        });
    }, [scrollY]);

    useEffect(() => {
        getScroll();
    }, [getScroll]);

    const transition = {
        repeatType: "loop",
        ease: "linear",
        duration: 60 * 4,
        repeat: Infinity,
    } as const;

    const opacity = 1 - percent / 100;

    const hide = percent > 120;

    const renderDescription = (
        <Stack
            alignItems="flex-start"
            justifyContent="center"
            spacing={3}
            sx={{
                height: 1,
                maxWidth: 530,
                opacity: opacity > 0 ? opacity : 0,
                mt: {
                    md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
                },
            }}
        >
            <m.div variants={varFade().in}>
                <Typography component="h1" variant="h2" sx={{ fontSize: pxToRem(48) }}>
                    Create unique <br />{" "}
                    <StyledTextGradient
                        animate={{ backgroundPosition: "200% center" }}
                        transition={transition}
                    >
                        FACELESS VIDEOS
                    </StyledTextGradient>{" "}
                    <br />
                    <Typography component="span" variant="h4">
                        While focusing on your business
                    </Typography>
                </Typography>
            </m.div>

            <m.div variants={varFade().in}>
                <Typography variant="body2">
                    Remove the mental load of producing content for your brand, by generating them
                    with AI. No skills required
                </Typography>
            </m.div>

            <m.div variants={varFade().in}>
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
        </Stack>
    );

    const renderSlides = (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                opacity: opacity > 0 ? opacity : 0,
                ".slick-list": {
                    overflow: "visible",
                },
                "slick-slide": {
                    maxWidth: 200,
                },
            }}
        >
            <Carousel {...settings}>
                <ReactPlayer
                    url="assets/demo-video1.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
                <ReactPlayer
                    url="assets/demo-video2.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />

                <ReactPlayer
                    url="assets/demo-video3.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />

                <ReactPlayer
                    url="assets/demo-video4.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
            </Carousel>
            <Carousel {...settings} rtl>
                <ReactPlayer
                    url="assets/demo-video1.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
                <ReactPlayer
                    url="assets/demo-video2.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
                <ReactPlayer
                    url="assets/demo-video3.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
                <ReactPlayer
                    url="assets/demo-video4.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
            </Carousel>
            <Carousel {...settings}>
                <ReactPlayer
                    url="assets/demo-video1.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
                <ReactPlayer
                    url="assets/demo-video2.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
                <ReactPlayer
                    url="assets/demo-video3.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
                <ReactPlayer
                    url="assets/demo-video4.mp4"
                    width={200}
                    height={355}
                    loop
                    playing
                    muted
                />
            </Carousel>
        </Stack>
    );

    const renderPolygons = (
        <>
            <StyledPolygon />
            <StyledPolygon anchor="right" opacity={0.48} />
            <StyledPolygon anchor="right" opacity={0.48} sx={{ height: 48, zIndex: 10 }} />
            <StyledPolygon anchor="right" sx={{ zIndex: 11, height: 24 }} />
        </>
    );

    const renderEllipses = (
        <>
            {smUp && <StyledEllipseTop />}
            <StyledEllipseBottom />
        </>
    );

    return (
        <>
            <StyledRoot
                ref={heroRef}
                sx={{
                    ...(hide && {
                        opacity: 0,
                    }),
                }}
            >
                <StyledWrapper>
                    <Container component={MotionContainer} sx={{ height: 1 }}>
                        <Grid
                            container
                            columnSpacing={{ md: 10 }}
                            sx={{ height: 1, position: "relative" }}
                        >
                            <Grid xs={12} sm={7} md={6}>
                                {renderDescription}
                            </Grid>

                            {smUp && (
                                <Grid sm={5} md={6} sx={{ position: "absolute", right: 0 }}>
                                    {renderSlides}
                                </Grid>
                            )}
                        </Grid>
                    </Container>

                    {renderEllipses}
                </StyledWrapper>
            </StyledRoot>

            {smUp && renderPolygons}

            <Box sx={{ height: { md: "100vh" } }} />
        </>
    );
}
