import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";

import { MotionViewport, varFade } from "@/components/animate";
import Image from "@/components/image";

// ----------------------------------------------------------------------

export default function HomeFilesManagerShowcase() {
    const renderDescription = (
        <Stack alignItems="center" spacing={3}>
            <m.div variants={varFade().inUp}>
                <Typography component="div" variant="overline" sx={{ color: "primary.main" }}>
                    Easy to manage files
                </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
                <Typography variant="h2" sx={{ color: "common.white" }}>
                    Files Manager
                </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
                <Typography sx={{ color: "grey.500" }}>
                    A fully integrated files manager to easy your storing
                </Typography>
            </m.div>
        </Stack>
    );

    const renderImg = (
        <m.div variants={varFade().inUp}>
            <Image
                alt="darkmode"
                src="/assets/images/home/files-manager.jpg"
                sx={{
                    borderRadius: 2,
                    my: { xs: 5, md: 10 },
                    boxShadow: (theme) =>
                        `-40px 40px 80px ${alpha(theme.palette.common.black, 0.24)}`,
                }}
            />
        </m.div>
    );

    return (
        <Box
            sx={{
                textAlign: "center",
                bgcolor: "grey.900",
                pt: { xs: 10, md: 15 },
                pb: { xs: 10, md: 20 },
            }}
        >
            <Container component={MotionViewport}>
                {renderDescription}

                {renderImg}
            </Container>
        </Box>
    );
}
