"use client";

import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Unstable_Grid";

import { LoadingScreen } from "@/components/loading-screen";
import { useSettingsContext } from "@/components/settings";
import { useGetVideos } from "@/services/videosService/hooks/useGetVideos";

import VideosListVideoCard from "../components/videos-list/videos-list-video-card";

// ----------------------------------------------------------------------

export default function VideosListView() {
    const settings = useSettingsContext();
    const { videos, isVideosLoading } = useGetVideos();

    if (isVideosLoading) {
        return <LoadingScreen />;
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : "xl"}>
            <Stack
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            >
                <Typography variant="h3"> Videos </Typography>
            </Stack>
            <Stack>
                <Grid container spacing={3}>
                    {videos.map((video) => (
                        <Grid key={video.id} xs={12} md={4}>
                            <VideosListVideoCard video={video} />
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Container>
    );
}
