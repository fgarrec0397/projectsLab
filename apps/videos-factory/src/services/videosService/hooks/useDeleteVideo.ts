import { useSnackbar } from "notistack";

import { useAuthContext } from "@/auth/hooks";
import { deleteVideo as deleteVideoService } from "@/services/videosService/videosService";

import { useGetOrCreateVideoDraft } from "./useGetOrCreateVideoDraft";

export const useDeleteVideo = () => {
    const auth = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const { mutateVideoDraft } = useGetOrCreateVideoDraft();

    const deleteVideo = async (videoId: string) => {
        try {
            await deleteVideoService(auth.user?.accessToken, videoId);
            enqueueSnackbar("Video deleted with success");
            mutateVideoDraft();
        } catch (error) {
            enqueueSnackbar("Something happened wrong, the video was not deleted", {
                variant: "error",
            });
        }
    };

    return deleteVideo;
};
