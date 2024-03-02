import { useSnackbar } from "notistack";

import { useAuthContext } from "@/auth/hooks";
import { saveDraft as saveDraftService } from "@/services/videosService/videosService";
import { IVideoDraft } from "@/types/video";

import { useGetVideoDraft } from "./useGetVideoDraft";
import { useGetVideos } from "./useGetVideos";

export const useSaveDraft = () => {
    const auth = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const { mutateVideos } = useGetVideos();
    const { mutateVideoDraft } = useGetVideoDraft();

    const saveDraft = async (videoDraft: IVideoDraft) => {
        try {
            await saveDraftService(auth.user?.accessToken, {
                ...videoDraft,
                id: videoDraft?.id,
            });
            mutateVideos();
            mutateVideoDraft();
            enqueueSnackbar("Video draft saved with success!");
        } catch (error) {
            enqueueSnackbar("The video draft was not saved correctly", { variant: "error" });
        }
    };

    return saveDraft;
};
