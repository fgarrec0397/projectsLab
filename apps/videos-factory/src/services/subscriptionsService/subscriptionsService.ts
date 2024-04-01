import { endpoints } from "@/routes/endpoints";
import axiosInstance from "@/utils/axios";

export const getCheckoutURL = async (
    accessToken: string | undefined,
    email: string,
    variantId: string
) => {
    const response = await axiosInstance.get<string>(
        `${endpoints.subscriptions.checkout.get}?email=${email}&variantId=${variantId}`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
                "ngrok-skip-browser-warning": "asd",
            },
        }
    );

    return response.data;
};
