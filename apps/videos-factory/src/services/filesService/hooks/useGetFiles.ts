"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { GetFilesParams } from "@/services/filesService/filesService";

import { getFilesFetcher } from "../filesFetchers";

export const useGetFiles = () => {
    const auth = useAuthContext();
    const params = useSearchParams();

    const pathParam = params.get("path") || undefined;

    const swrKey: GetFilesParams = useMemo(
        () => [auth.user?.accessToken, auth.user?.id, pathParam],
        [auth.user?.accessToken, auth.user?.id, pathParam]
    );

    const { data, isLoading, error, isValidating } = useSWR(swrKey, getFilesFetcher);

    const memoizedResponse = useMemo(
        () => ({
            files: data || [],
            isFilesLoading: isLoading,
            filesError: error,
            isFilesValidating: isValidating,
        }),
        [error, data, isLoading, isValidating]
    );
    return memoizedResponse;
};
