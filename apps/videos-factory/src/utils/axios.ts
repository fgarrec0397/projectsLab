import axios from "axios";

import { HOST_API } from "@/config-global";

import { showSnackbar } from "./notistackManager";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

// axiosInstance.interceptors.

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response && error.response.status === 401) {
            showSnackbar("Session expired. Please reload the page or log in again", {
                variant: "error",
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const getErrorMessage = (error: any): any | undefined => {
    return error.response?.data?.message;
};
