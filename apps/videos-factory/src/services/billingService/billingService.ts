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
        },
    });

    return response.data || [];
};
