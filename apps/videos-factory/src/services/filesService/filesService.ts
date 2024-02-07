import axios from "axios";

import { endpoints } from "@/routes/endpoints";
import { IFileDTO } from "@/types/file";

export const getFiles = async (idToken: string, userId: string) => {
    const response = await axios.get<IFileDTO>(`${endpoints.files.get}?userId=${userId}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${idToken}`,
        },
    });

    console.log(response.data, "response");
};
