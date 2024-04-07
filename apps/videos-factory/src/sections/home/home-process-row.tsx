import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { m } from "framer-motion";

import { MotionViewport, varFade } from "@/components/animate";
import Image from "@/components/image";

// ----------------------------------------------------------------------

export type ProcessRow = {
    title: string;
    subTitle: string;
    description: string;
    image: string;
};

type Props = {
    isReversed?: boolean;
    process: ProcessRow;
};

export default function HomeProcessRow({ process, isReversed }: Props) {
    const renderDescription = (
        <Stack
            sx={{
                textAlign: {
                    xs: "center",
                    md: "left",
                },
            }}
        >
            <m.div variants={varFade().inDown}>
                <Typography variant="subtitle1" sx={{ color: "text.disabled" }}>
                    {process.subTitle}
                </Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
                <Typography
                    variant="h3"
                    sx={{
                        mt: 3,
                    }}
                >
                    {process.title}
                </Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
                <Typography
                    variant="body1"
                    sx={{
                        mt: 3,
                        mb: { md: 5 },
                    }}
                >
                    {process.description}
                </Typography>
            </m.div>
        </Stack>
    );

    return (
        <Container
            component={MotionViewport}
            sx={{
                py: { xs: 3, md: 6 },
            }}
        >
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={{ xs: 5, md: 0 }}
            >
                {isReversed ? (
                    <>
                        <Grid xs={12} md={4}>
                            {renderDescription}
                        </Grid>

                        <Grid xs={12} md={7}>
                            <m.div variants={varFade().inUp}>
                                <Image disabledEffect alt="rocket" src={process.image} />
                            </m.div>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid xs={12} md={7}>
                            <m.div variants={varFade().inUp}>
                                <Image disabledEffect alt="rocket" src={process.image} />
                            </m.div>
                        </Grid>
                        <Grid xs={12} md={4}>
                            {renderDescription}
                        </Grid>
                    </>
                )}
            </Grid>
        </Container>
    );
}
