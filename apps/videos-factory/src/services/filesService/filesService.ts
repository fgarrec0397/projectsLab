import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr";

import { useAuthContext } from "@/auth/hooks";
import { endpoints } from "@/routes/endpoints";
import { fetcher } from "@/utils/axios";

export const getFiles = async (idToken: string, userId: string) => {
    const response = await axios.get(`${endpoints.files.get}?userId=${userId}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${idToken}`,
        },
    });

    console.log(response, "response");
};
