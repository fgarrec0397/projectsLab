import { endpoints } from "@/routes/endpoints";
import { IUser } from "@/types/user";
import axiosInstance from "@/utils/axios";

export async function createUser(accessToken: string | undefined, userId: string) {
    try {
        return await axiosInstance.post(
            endpoints.users.create,
            { userId },
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error;
    }
}

export const getUserById = async (accessToken: string | undefined, userId: string) => {
    const response = await axiosInstance.get<IUser>(`${endpoints.users.byId(userId)}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};
