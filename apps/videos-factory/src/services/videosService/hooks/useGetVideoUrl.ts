"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { IVideo } from "@/types/video";

import { getVideoUrlById } from "../videosService";

export const useGetVideoUrl = (videoId?: string) => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating, mutate } = useSWR<string>(
        [auth.user?.accessToken, videoId, "video-url"],
        () => getVideoUrlById(auth.user?.accessToken, videoId),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    const memoizedResponse = useMemo(
        () => ({
            videoUrl: data,
            isVideoUrlLoading: isLoading,
            videoUrlError: error,
            isVideoUrlValidating: isValidating,
            mutateVideoUrl: mutate,
            isVideoUrlReady: !isLoading || !isValidating,
        }),
        [data, isLoading, error, isValidating, mutate]
    );

    return memoizedResponse;
};
