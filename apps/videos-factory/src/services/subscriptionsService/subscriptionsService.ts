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

    console.log(response.data, "response.data");

    return response.data;
};
