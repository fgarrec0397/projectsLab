import { endpoints } from "@/routes/endpoints";
import { IVideo, IVideoDraft } from "@/types/video";
import axiosInstance from "@/utils/axios";

export const getVideos = async (accessToken: string | undefined) => {
    const url = `${endpoints.videos.get}?withThumbnails=true`;

    if (!accessToken) {
        return [];
    }

    const response = await axiosInstance.get<IVideo[]>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "asd",
        },
    });

    return response.data;
};

export const getVideoById = async (accessToken: string | undefined, videoId?: string) => {
    const url = endpoints.videos.byId(videoId);

    if (!accessToken) {
        return;
    }

    const response = await axiosInstance.get<IVideo>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const getVideoUrlById = async (accessToken: string | undefined, videoId?: string) => {
    const url = endpoints.videos.videoUrl.byId(videoId);

    const response = await axiosInstance.get<string>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const getVideoDraft = async (accessToken: string | undefined) => {
    const url = `${endpoints.videos.draft.getLast}`;

    const response = await axiosInstance.get<IVideoDraft>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const saveDraft = async (accessToken: string | undefined, videoDraft: IVideoDraft) => {
    const url = `${endpoints.videos.draft.save}`;

    const response = await axiosInstance.patch<IVideoDraft>(url, videoDraft, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const startRendering = async (accessToken: string | undefined, videoDraft: IVideoDraft) => {
    const url = `${endpoints.videos.startRendering}`;

    const response = await axiosInstance.post<IVideoDraft>(url, videoDraft, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const deleteVideo = async (accessToken: string | undefined, videoId: string) => {
    const url = `${endpoints.videos.delete}/${videoId}`;

    const response = await axiosInstance.delete<IVideoDraft>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};
