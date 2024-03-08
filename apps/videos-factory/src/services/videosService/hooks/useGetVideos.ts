"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { useSocket } from "@/services/socket/useSocket";
import { IVideo } from "@/types/video";

import { getVideos } from "../videosService";

export const useGetVideos = () => {
    const auth = useAuthContext();
    // const socket = useSocket({
    //     event: "videoProcessingSteps",
    //     onMessage: (message) => {
    //         console.log(message, "message");
    //     },
    // });
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
