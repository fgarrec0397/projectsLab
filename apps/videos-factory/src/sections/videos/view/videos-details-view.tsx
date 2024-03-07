"use client";

import { Card, CardContent, useTheme } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import ReactPlayer from "react-player";

import FilesTableCard from "@/components/files-table-card/files-table-card";
import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { paths } from "@/routes/paths";
import { useGetFiles } from "@/services/filesService/hooks/useGetFiles";
import { useGetVideoById } from "@/services/videosService/hooks/useGetVideoById";
import { useGetVideoUrl } from "@/services/videosService/hooks/useGetVideoUrl";
import { pxToRem } from "@/theme/typography";
import { VideoStatus } from "@/types/video";

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
        () => allFiles.filter((x) => video?.files.includes(x.id)),
        [video, allFiles]
    );

    if (!video && isVideoReady) {
        router.push(paths.notFound);
    }

    if (video?.status === VideoStatus.Draft) {
        router.push(paths.dashboard.videos.create);
    }

    return (
        <PageWrapper title={video?.name} isLoading={isVideoLoading}>
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <ReactPlayer
                        url={videoUrl}
                        controls
                        style={{
                            backgroundColor: theme.palette.common.black,
                            borderRadius: 10,
                        }}
                        width="100%"
                        height={pxToRem(505)}
                        // config={{
                        //     file: {
                        //         attributes: {
                        //             style: {
                        //                 borderRadius: "10px",
                        //             },
                        //         },
                        //     },
                        // }}
                    />
                </Grid>
                <Grid xs={12} md={4}>
                    <FilesTableCard title="Used assets" files={files} />
                </Grid>
            </Grid>
        </PageWrapper>
    );
}
