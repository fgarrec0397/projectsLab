"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { IVideoDraft } from "@/types/video";

import { getVideoDraft } from "../videosService";

export const useGetVideoDraft = () => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating, mutate } = useSWR<IVideoDraft>(
        [auth.user?.accessToken, "videoDraft"],
        () => getVideoDraft(auth.user?.accessToken),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        }
    );

    const memoizedResponse = useMemo(
        () => ({
            videoDraft: data,
            isVideoDraftLoading: isLoading,
            videoDraftError: error,
            isVideoDraftValidating: isValidating,
            mutateVideoDraft: mutate,
        }),
        [data, isLoading, error, isValidating, mutate]
    );

    return memoizedResponse;
};
