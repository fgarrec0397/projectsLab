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

    useOnVideoUpdate((value) => {
        const videoExists = data?.findIndex((x) => x.id === value?.id) !== -1;

        mutate(
            async () => {
                const promise = new Promise<IVideo[]>((resolve) => {
                    const newData =
                        data?.map((x) => {
                            if (x.id === value?.id) {
                                return { ...x, ...value };
                            }

                            return x;
                        }) || [];

                    resolve(newData);
                });

                return promise;
            },
            { revalidate: !videoExists }
        );
    });

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
