import { endpoints } from "@/routes/endpoints";
import { IPlan } from "@/types/billing";
import axiosInstance from "@/utils/axios";

export const getPricingPlans = async (accessToken: string | undefined) => {
    if (!accessToken) {
        return new Promise<IPlan[]>((_, reject) => reject({ data: [] }));
    }

    const response = await axiosInstance.get<IPlan[]>(endpoints.billing.plans.get, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "asd",
        },
    });

    return response.data || [];
};

export const getCheckoutURL = async (
    accessToken: string | undefined,
    email: string,
    variantId: string
) => {
    const response = await axiosInstance.get<string>(
        `${endpoints.billing.checkout.get}?email=${email}&variantId=${variantId}`,
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
