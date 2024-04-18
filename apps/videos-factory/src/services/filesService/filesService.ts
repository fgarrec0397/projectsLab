import { mutate } from "swr";

import { endpoints } from "@/routes/endpoints";
import { IFile } from "@/types/file";
import axiosInstance from "@/utils/axios";

export type GetFilesParams = [string | undefined, string | undefined];

export const getFiles = async (accessToken: string | undefined, path: string | undefined) => {
    if (!accessToken) {
        return new Promise<IFile[]>((_, reject) => reject({ data: [] }));
    }

    let url = `${endpoints.files.get}?all=true`;

    if (path) {
        url += `&path=${path}`;
    }

    const response = await axiosInstance.get<IFile[]>(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data || [];
};

export const uploadFiles = async (
    accessToken: string | undefined,
    path: string | undefined, // TODO - implement upload file in a specific folder later
    files: File[]
) => {
    const formData = new FormData();
    const url = `${endpoints.files.post}`;

    const swrKey: GetFilesParams = [accessToken, undefined];

    files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
    });

    try {
        const response = await axiosInstance.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        mutate(swrKey);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createFolder = async (
    accessToken: string | undefined,
    folderName: string | undefined,
    path: string | undefined // TODO - implement createFolder in a specific folder later
) => {
    const url = `${endpoints.files.createFolder}?folderName=${folderName}`;
    const swrKey: GetFilesParams = [accessToken, undefined];

    try {
        const response = await axiosInstance.post(url, undefined, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        mutate(swrKey);

        return response.data;
    } catch (error) {
        throw error;
    }
};

// TODO add a loader when fetching

export const renameFile = async (
    accessToken: string | undefined,
    filePath: string | undefined,
    newFileName: string | undefined
) => {
    const url = `${endpoints.files.rename}`;
    const swrKey: GetFilesParams = [accessToken, undefined];

    try {
        const response = await axiosInstance.patch(
            url,
            {
                filePath,
                newFileName,
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        mutate(swrKey);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const renameFolder = async (
    accessToken: string | undefined,
    folderName: string | undefined,
    newFolderName: string | undefined
) => {
    const url = `${endpoints.files.rename}`;
    const swrKey: GetFilesParams = [accessToken, undefined];

    try {
        const response = await axiosInstance.patch(
            url,
            {
                filePath: folderName,
                newFileName: newFolderName,
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        mutate(swrKey);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteFiles = async (accessToken: string | undefined, fileId: string | string[]) => {
    let fileIdParam = fileId;

    if (Array.isArray(fileIdParam)) {
        fileIdParam = fileIdParam.join(",");
    }

    const url = `${endpoints.files.delete}?fileIds=${encodeURIComponent(fileIdParam)}`;
    const swrKey: GetFilesParams = [accessToken, undefined];

    try {
        const response = await axiosInstance.delete(url, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        mutate(swrKey);

        return response.data;
    } catch (error) {
        throw error;
    }
};
