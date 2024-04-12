import { endpoints } from "@/routes/endpoints";
import { IUser } from "@/types/user";
import axiosInstance from "@/utils/axios";

export const getUserById = async (accessToken: string | undefined, userId: string) => {
    const response = await axiosInstance.get<IUser>(`${endpoints.users.byId(userId)}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};
