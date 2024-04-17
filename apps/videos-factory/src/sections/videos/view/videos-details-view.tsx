"use client";

import { Box, Card, CardContent, CardHeader, Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import ReactPlayer from "react-player";

import { SecondaryButton } from "@/components/button";
import FilesTableCard from "@/components/files-table-card/files-table-card";
import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { paths } from "@/routes/paths";
import { useGetFiles } from "@/services/filesService/hooks/useGetFiles";
import { useGetVideoById } from "@/services/videosService/hooks/useGetVideoById";
import { useGetVideoUrl } from "@/services/videosService/hooks/useGetVideoUrl";
import { pxToRem } from "@/theme/typography";
import { VideoStatus } from "@/types/video";

import VideosStatus from "../components/common/videos-status";

// ----------------------------------------------------------------------

type Props = {
    videoId?: string;
};

export default function VideosDetailsView({ videoId }: Props) {
    const router = useRouter();
    const { allFiles } = useGetFiles();
    const { videoUrl } = useGetVideoUrl(videoId);
    const { video, isVideoLoading, isVideoReady } = useGetVideoById(videoId);
    const theme = useTheme();

    const files = useMemo(
        () => allFiles.filter((x) => video?.files?.includes(x.id)),
        [video, allFiles]
    );

    if (!video && isVideoReady) {
        router.push(paths.notFound);
    }

    if (video?.status === VideoStatus.Draft) {
        router.push(paths.dashboard.videos.create);
    }

    return (
        <PageWrapper
            title={video?.name}
            backLink={paths.dashboard.videos.root}
            isLoading={isVideoLoading}
            titleItem={
                <Stack spacing={2} direction="row" alignItems="center">
                    <VideosStatus status={video?.status} size="medium" />
                    <SecondaryButton href={videoUrl}>Download video</SecondaryButton>
                </Stack>
            }
            subContent={
                video?.failedReason !== undefined && (
                    <Typography color="error">{video.failedReason}</Typography>
                )
            }
        >
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <ReactPlayer
                        url={videoUrl}
                        controls
                        style={{
                            backgroundColor: theme.palette.common.black,
                            borderRadius: pxToRem(16),
                        }}
                        width="100%"
                        height={pxToRem(600)}
                        config={{
                            file: {
                                attributes: {
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: pxToRem(16),
                                    },
                                },
                            },
                        }}
                    />
                </Grid>
                <Grid xs={12} md={4}>
                    <FilesTableCard title="Used assets" files={files} maxHeight={600} />
                </Grid>
                <Grid xs={12}>
                    <Card>
                        <CardHeader title="Details" sx={{ mb: 2 }} />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={6}>
                                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                        Target audience
                                    </Typography>
                                    <div>
                                        <Grid container spacing={3}>
                                            <Grid xs={12} sm={6}>
                                                <Stack spacing={1}>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Location
                                                        </Typography>
                                                        <Typography>{video?.location}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Age
                                                        </Typography>
                                                        <Typography>
                                                            {video?.age[0]} - {video?.age[1]}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <Stack spacing={1}>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Gender
                                                        </Typography>
                                                        <Typography>{video?.gender}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Language
                                                        </Typography>
                                                        <Typography>{video?.language}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="subtitle2">
                                                        Hobbies, interests, preferences
                                                    </Typography>
                                                    <Typography>
                                                        {video?.interests || "Not specified"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="subtitle2">
                                                        Challenges are they facing
                                                    </Typography>
                                                    <Typography>
                                                        {video?.challenges || "Not specified"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                        Content
                                    </Typography>
                                    <div>
                                        <Grid container spacing={3}>
                                            <Grid xs={12} sm={6}>
                                                <Stack spacing={1}>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Topic
                                                        </Typography>
                                                        <Typography>{video?.topic}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Specificity
                                                        </Typography>
                                                        <Typography>
                                                            {video?.specificityLevel}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <Stack spacing={1}>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Structure type
                                                        </Typography>
                                                        <Typography>
                                                            {video?.structureType}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Pace
                                                        </Typography>
                                                        <Typography>{video?.pace}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="subtitle2">
                                                        More specifications
                                                    </Typography>
                                                    <Typography>
                                                        {video?.moreSpecificities ||
                                                            "Not specified"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageWrapper>
    );
}
