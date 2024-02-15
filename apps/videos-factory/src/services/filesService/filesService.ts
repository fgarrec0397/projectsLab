import axios from "axios";
import { mutate } from "swr";

import { endpoints } from "@/routes/endpoints";
import { IFile } from "@/types/file";

export type GetFilesParams = [string | undefined, string | undefined];

export const getFiles = async (accessToken: string | undefined, path: string | undefined) => {
    if (!accessToken) {
        return new Promise<IFile[]>((_, reject) => reject({ data: [] }));
    }

    let url = `${endpoints.files.get}?all=true`;

    if (path) {
        url += `&path=${path}`;
    }

    const response = await axios.get<IFile[]>(url, {
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

    const swrKey = [accessToken, undefined];

    files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
    });

    try {
        const response = await axios.post(url, formData, {
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
    const swrKey = [accessToken, undefined];

    try {
        const response = await axios.post(url, undefined, {
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
    const swrKey = [accessToken, undefined];

    try {
        const response = await axios.patch(
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
    const url = `${endpoints.files.createFolder}`;
    const swrKey = [accessToken, undefined];

    try {
        const response = await axios.post(
            url,
            {
                folderName,
                newFolderName,
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
