import axios from "axios";

import { endpoints } from "@/routes/endpoints";
import { IFile } from "@/types/file";

export type GetFilesParams = [string | undefined, string | undefined, string | undefined];

export const getFiles = async (
    accessToken: string | undefined,
    userId: string | undefined,
    path: string | undefined
) => {
    if (!accessToken || !userId) {
        return new Promise<IFile[]>((_, reject) => reject({ data: [] }));
    }

    let url = `${endpoints.files.get}?userId=${userId}`;

    if (path) {
        url += `&path=${path}`;
    }

    url += `&all=true`;

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
    userId: string | undefined,
    path: string | undefined, // TODO - implement upload file in a specific folder later
    files: File[]
) => {
    const formData = new FormData();
    const url = `${endpoints.files.post}?userId=${userId}`;

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
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createFolder = async (
    accessToken: string | undefined,
    userId: string | undefined,
    folderName: string | undefined
) => {
    const url = `${endpoints.files.createFolder}?userId=${userId}&folderName=${folderName}`;

    try {
        const response = await axios.post(url, undefined, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
