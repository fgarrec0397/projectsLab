import type { Fetcher } from "swr";

import { IFile } from "@/types/file";

import { getFiles, GetFilesParams } from "./filesService";

export const getFilesFetcher: Fetcher<IFile[], GetFilesParams> = async ([
    accessToken,
    userId,
    pathParam,
]) => getFiles(accessToken, userId, pathParam);
