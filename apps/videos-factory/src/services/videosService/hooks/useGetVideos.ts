"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { IVideo } from "@/types/video";

import { getVideos } from "../videosService";
import { useOnVideoUpdate } from "./useOnVideoUpdate";

export const useGetVideos = () => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating, mutate } = useSWR<IVideo[]>(
        [auth.user?.accessToken, "videos"],
        () => getVideos(auth.user?.accessToken),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    const updatedVideo = useOnVideoUpdate();

    const mergedVideos = useMemo(
        () =>
            data?.map((x) => {
                if (x.id === updatedVideo?.id) {
                    return { ...x, ...updatedVideo };
                }

                return x;
            }),
        [data, updatedVideo]
    );

    const memoizedResponse = useMemo(
        () => ({
            videos: mergedVideos || [],
            isVideosLoading: isLoading,
            videosError: error,
            isVideosValidating: isValidating,
            mutateVideos: mutate,
        }),
        [mergedVideos, isLoading, error, isValidating, mutate]
    );

    return memoizedResponse;
};
