"use client";

import { useEffect, useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { IVideoDraft } from "@/types/video";

import { getOrCreateVideoDraft } from "../videosService";

export const useGetOrCreateVideoDraft = () => {
    const auth = useAuthContext();

    const { data, isLoading, error, isValidating, mutate } = useSWR<IVideoDraft>(
        auth.user?.accessToken,
        getOrCreateVideoDraft,
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

    useEffect(() => {
        mutate(auth.user?.accessToken);
    }, [auth.user?.accessToken, mutate]);

    return memoizedResponse;
};
