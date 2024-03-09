"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { IVideo } from "@/types/video";

import { getVideos } from "../videosService";
import { useGetVideosStatus } from "./useGetVideosStatus";

export const useGetVideos = () => {
    const auth = useAuthContext();

    const socketOptions = useMemo(
        () => ({
            event: "videoProcessingSteps",
        }),
        []
    );

    // const socket = useGetVideosStatus();

    const [updatedVideo, setUpdatedVideo] = useState<IVideo>();

    const { data, isLoading, error, isValidating, mutate } = useSWR<IVideo[]>(
        [auth.user?.accessToken, "videos"],
        () => getVideos(auth.user?.accessToken),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    const memoizedResponse = useMemo(
        () => ({
            videos: data || [],
            isVideosLoading: isLoading,
            videosError: error,
            isVideosValidating: isValidating,
            mutateVideos: mutate,
        }),
        [data, isLoading, error, isValidating, mutate]
    );

    return memoizedResponse;
};
