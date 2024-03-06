"use client";

import Grid from "@mui/system/Unstable_Grid";
import { useRouter } from "next/navigation";

import { PrimaryButton } from "@/components/button";
import EmptyContent from "@/components/empty-content";
import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { paths } from "@/routes/paths";
import { useGetVideos } from "@/services/videosService/hooks/useGetVideos";

import VideosListVideoCard from "../components/videos-list/videos-list-video-card";

// ----------------------------------------------------------------------

export default function VideosDetailsView() {
    const router = useRouter();
    const { videos, isVideosLoading } = useGetVideos();

    return (
        <PageWrapper title="Video name" isLoading={isVideosLoading}>
            video details
        </PageWrapper>
    );
}
