"use client";

import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Unstable_Grid";
import { useRouter } from "next/navigation";

import { PrimaryButton } from "@/components/button";
import EmptyContent from "@/components/empty-content";
import { LoadingScreen } from "@/components/loading-screen";
import { useSettingsContext } from "@/components/settings";
import { paths } from "@/routes/paths";
import { useGetVideos } from "@/services/videosService/hooks/useGetVideos";

import VideosListVideoCard from "../components/videos-list/videos-list-video-card";

// ----------------------------------------------------------------------

export default function VideosListView() {
    const router = useRouter();
    const settings = useSettingsContext();
    const { videos, isVideosLoading } = useGetVideos();

    const handleCreateVideo = () => router.push(paths.dashboard.videos.create);

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
                {videos.length ? (
                    <Grid container spacing={3}>
                        {videos.map((video) => (
                            <Grid key={video.id} xs={12} md={6} xl={4}>
                                <VideosListVideoCard video={video} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <EmptyContent
                        title="You don't have any videos yet"
                        description="Create a video to see them appear here"
                        filled
                        action={
                            <PrimaryButton onClick={handleCreateVideo}>
                                Create a video now
                            </PrimaryButton>
                        }
                    />
                )}
            </Stack>
        </Container>
    );
}
