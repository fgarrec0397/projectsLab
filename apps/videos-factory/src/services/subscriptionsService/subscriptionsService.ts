import { endpoints } from "@/routes/endpoints";
import axiosInstance from "@/utils/axios";

export const updateSubscription = async (
    accessToken: string | undefined,
    newPriceId: string,
    isPreview = false
) => {
    const response = await axiosInstance.patch<any>(
        `${endpoints.subscriptions.update}?isPreview=${isPreview}`,
        {
            newPriceId,
            isPreview,
        },
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
};

export const cancelSubscription = async (accessToken: string | undefined, reason: string) => {
    const response = await axiosInstance.patch<any>(
        `${endpoints.subscriptions.cancel}`,
        {
            reason,
        },
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
};
