import axios from "axios";

import { endpoints } from "@/routes/endpoints";
import { IVideo } from "@/types/video";

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
    const url = `${endpoints.videos.getOrCreateDraft}`;

    const response = await axios.get<IVideo>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};
