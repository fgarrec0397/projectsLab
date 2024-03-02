import axios from "axios";
import { mutate } from "swr";

import { endpoints } from "@/routes/endpoints";
import { IVideo, IVideoDraft } from "@/types/video";

export const mutateVideosDraft = (accessToken: string | undefined) =>
    mutate([accessToken, "videoDraft"]);

export const mutateVideos = (accessToken: string | undefined) => {
    mutate([accessToken, "videos"]);
};

export const getVideos = async (accessToken: string | undefined) => {
    const url = `${endpoints.videos.get}`;

    console.log("getVideos called");

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
    console.log("getOrCreateVideoDraft called");

    const response = await axios.get<IVideoDraft>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    // mutateVideos(accessToken);

    return response.data;
};

export const saveDraft = async (accessToken: string | undefined, videoDraft: IVideoDraft) => {
    const url = `${endpoints.videos.draft.save}`;
    console.log("saveDraft called");

    const response = await axios.patch<IVideoDraft>(url, videoDraft, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const startRendering = async (accessToken: string | undefined, videoDraft: IVideoDraft) => {
    const url = `${endpoints.videos.startRendering}`;

    const response = await axios.post<IVideoDraft>(url, videoDraft, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    mutateVideos(accessToken);
    // mutateVideosDraft(accessToken);

    return response.data;
};

export const deleteVideo = async (accessToken: string | undefined, videoId: string) => {
    const url = `${endpoints.videos.delete}/${videoId}`;

    const response = await axios.delete<IVideoDraft>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    mutateVideos(accessToken);

    return response.data;
};
