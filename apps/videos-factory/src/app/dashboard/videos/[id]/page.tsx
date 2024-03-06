import VideosDetailsView from "@/sections/videos/view/videos-details-view";

interface Props {
    params: {
        id: string;
    };
}

export default function VideoDetailsPage({ params }: Props) {
    const { id } = params;

    return <VideosDetailsView videoId={id} />;
}
