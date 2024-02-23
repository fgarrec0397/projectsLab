import axios from "axios";
import { mutate } from "swr";

import { endpoints } from "@/routes/endpoints";
import { IVideo, IVideoDraft } from "@/types/video";

export const getVideos = async (accessToken: string | undefined) => {
    const url = `${endpoints.videos.get}`;

    const response = await axios.get<IVideo[]>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const getVideoById = async (accessToken: string | undefined, videoId: string) => {
    const url = `${endpoints.videos.get}/${videoId}`;

    const response = await axios.get<IVideo>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const getOrCreateVideoDraft = async (accessToken: string | undefined) => {
    const url = `${endpoints.videos.draft.getOrCreate}`;

    const response = await axios.get<IVideoDraft>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const saveDraft = async (accessToken: string | undefined, videoDraft: IVideoDraft) => {
    const url = `${endpoints.videos.draft.save}`;

    const response = await axios.patch<IVideoDraft>(url, videoDraft, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    mutate(accessToken);

    return response.data;
};
