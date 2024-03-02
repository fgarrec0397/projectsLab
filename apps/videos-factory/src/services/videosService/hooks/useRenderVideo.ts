import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import { useAuthContext } from "@/auth/hooks";
import { paths } from "@/routes/paths";
import { startRendering } from "@/services/videosService/videosService";
import { IVideo } from "@/types/video";

import { useGetOrCreateVideoDraft } from "./useGetOrCreateVideoDraft";
import { useGetVideos } from "./useGetVideos";

export const useRenderVideo = () => {
    const router = useRouter();
    const auth = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const { mutateVideos } = useGetVideos();
    const { mutateVideoDraft } = useGetOrCreateVideoDraft();

    const renderVideo = async (video: IVideo) => {
        try {
            await startRendering(auth.user?.accessToken, video);

            enqueueSnackbar("Video creation started");
            mutateVideos();
            mutateVideoDraft();
            router.push(paths.dashboard.videos.root);
        } catch (error) {
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    };

    return renderVideo;
};
