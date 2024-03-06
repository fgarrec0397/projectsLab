"use client";

import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";

import PageWrapper from "@/components/page-wrapper/page-wrapper";
import { paths } from "@/routes/paths";
import { useGetVideoById } from "@/services/videosService/hooks/useGetVideoById";
import { VideoStatus } from "@/types/video";

// ----------------------------------------------------------------------

type Props = {
    videoId?: string;
};

export default function VideosDetailsView({ videoId }: Props) {
    const router = useRouter();
    const { video, isVideoLoading, isVideoReady } = useGetVideoById(videoId);

    if (!video && isVideoReady) {
        router.push(paths.notFound);
    }

    if (video?.status === VideoStatus.Draft) {
        router.push(paths.dashboard.videos.create);
    }

    return (
        <PageWrapper title={video?.name} isLoading={isVideoLoading}>
            <ReactPlayer
                url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
                controls
            />
        </PageWrapper>
    );
}
