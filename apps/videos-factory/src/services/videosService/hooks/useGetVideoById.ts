"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { IVideo } from "@/types/video";

import { getVideoById } from "../videosService";
import { useOnVideoUpdate } from "./useOnVideoUpdate";

export const useGetVideoById = (videoId?: string) => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating, mutate } = useSWR<IVideo>(
        [auth.user?.accessToken, videoId, "video"],
        () => getVideoById(auth.user?.accessToken, videoId),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    // useOnVideoUpdate((value) => {
    //     mutate(
    //         async () => {
    //             const promise = new Promise<IVideo>((resolve) => {
    //                 resolve(value);
    //             });

    //             return promise;
    //         },
    //         { revalidate: false }
    //     );
    // });

    const memoizedResponse = useMemo(
        () => ({
            video: data,
            isVideoLoading: isLoading,
            videoError: error,
            isVideoValidating: isValidating,
            mutateVideo: mutate,
            isVideoReady: !isLoading || !isValidating,
        }),
        [data, isLoading, error, isValidating, mutate]
    );

    return memoizedResponse;
};
