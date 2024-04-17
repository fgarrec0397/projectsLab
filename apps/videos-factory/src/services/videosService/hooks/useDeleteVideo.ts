import { useSnackbar } from "notistack";

import { useAuthContext } from "@/auth/hooks";
import { useGetCurrentUser } from "@/services/usersService/hooks/useGetCurrentUser";
import { deleteVideo as deleteVideoService } from "@/services/videosService/videosService";

import { useGetVideoDraft } from "./useGetVideoDraft";
import { useGetVideos } from "./useGetVideos";

export const useDeleteVideo = () => {
    const auth = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const { mutateVideos } = useGetVideos();
    const { mutateCurrentUser } = useGetCurrentUser();
    const { mutateVideoDraft } = useGetVideoDraft();

    const deleteVideo = async (videoId: string) => {
        try {
            await deleteVideoService(auth.user?.accessToken, videoId);
            enqueueSnackbar("Video deleted with success");
            mutateVideoDraft();
            mutateVideos();
            mutateCurrentUser();
        } catch (error) {
            enqueueSnackbar("Something happened wrong, the video was not deleted", {
                variant: "error",
            });
        }
    };

    return deleteVideo;
};
