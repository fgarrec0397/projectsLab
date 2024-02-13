"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { GetFilesParams } from "@/services/filesService/filesService";
import { IFile, IFileManager, IFolderManager } from "@/types/file";

import { getFilesFetcher } from "../filesFetchers";
import { countFilesInFolder } from "../utils/couFilesInFolder";
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
        () => [auth.user?.accessToken, auth.user?.id, memoizedpathParam],
        [auth.user?.accessToken, auth.user?.id, memoizedpathParam]
    );

    const { data, isLoading, error, isValidating } = useSWR(swrKey, getFilesFetcher);

    const files = useMemo(() => {
        const mappedFiles: IFile[] =
            data?.map((x) => {
                if (x.type === "folder") {
                    return {
                        ...x,
                        totalFiles: countFilesInFolder(data, pathParam || "root"),
                    } as IFolderManager;
                }

                return x as IFileManager;
            }) || [];

        const isRoot = !pathParam;

        if (isRoot) {
            return mappedFiles?.filter(rootFileFilter);
        }

        return mappedFiles?.filter((x) => noneRootFileFilter(x, pathParam));
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
