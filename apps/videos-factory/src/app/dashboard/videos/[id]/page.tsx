interface Props {
    params: {
        id: string;
    };
}

export default function VideoDetailsPage({ params }: Props) {
    const { id } = params;

    // return <PostDetailsHomeView title={title} />;
    return <>Video details {id}</>;
}
