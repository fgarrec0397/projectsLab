import axios from "axios";

import { endpoints } from "@/routes/endpoints";
import { IFileDTO } from "@/types/file";

export const getFiles = async (accessToken?: string, userId?: string, path?: string) => {
    return axios.get<IFileDTO>(`${endpoints.files.get}?userId=${userId}&path=${path}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    // console.log(response.data, "response");

    // return response;
};

export const getFilesFetcher = (accessToken?: string, userId?: string, path?: string) =>
    getFiles(accessToken, userId, path);
