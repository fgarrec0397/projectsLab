import { endpoints } from "@/routes/endpoints";
import { IPlan } from "@/types/billing";
import axiosInstance from "@/utils/axios";

export const getPricingPlans = async () => {
    const response = await axiosInstance.get<IPlan[]>(endpoints.plans.get, {
        headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "asd",
        },
    });

    return response.data || [];
};
