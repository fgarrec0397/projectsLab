"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { GetFilesParams } from "@/services/filesService/filesService";

import { getFilesFetcher } from "../filesFetchers";
import { noneRootFileFilter, rootFileFilter } from "../utils/filters";

const shouldFetchFilesByFolder = false;

export const useGetFiles = () => {
    const auth = useAuthContext();
    const params = useSearchParams();
    const pathParam = params.get("path") || undefined;

    const memoizedpathParam = useMemo(
        () => (shouldFetchFilesByFolder ? pathParam : undefined),
        [pathParam]
    );

    const swrKey: GetFilesParams = useMemo(
        () => [auth.user?.accessToken, memoizedpathParam],
        [auth.user?.accessToken, memoizedpathParam]
    );

    const { data, isLoading, error, isValidating } = useSWR(swrKey, getFilesFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
    });

    const files = useMemo(() => {
        const isRoot = !pathParam;

        if (isRoot) {
            return data?.filter(rootFileFilter);
        }

        return data?.filter((x) => noneRootFileFilter(x, pathParam));
    }, [data, pathParam]);

    const memoizedResponse = useMemo(
        () => ({
            files: files || [],
            isFilesLoading: isLoading,
            filesError: error,
            isFilesValidating: isValidating,
        }),
        [files, isLoading, error, isValidating]
    );
    return memoizedResponse;
};
