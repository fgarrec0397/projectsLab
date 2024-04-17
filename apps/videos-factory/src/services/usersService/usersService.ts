import { endpoints } from "@/routes/endpoints";
import { IUser } from "@/types/user";
import axiosInstance from "@/utils/axios";

export async function createUser(accessToken: string | undefined, user: Partial<IUser>) {
    if (!accessToken) {
        return;
    }

    try {
        return await axiosInstance.post(endpoints.users.create, user, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error;
    }
}

export const getCurrentUser = async (accessToken: string | undefined) => {
    const response = await axiosInstance.get<IUser>(`${endpoints.users.current}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const getUserById = async (accessToken: string | undefined, userId: string) => {
    const response = await axiosInstance.get<IUser>(`${endpoints.users.byId(userId)}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const updateUser = async (
    accessToken: string | undefined,
    userId: string,
    data: Partial<IUser>
) => {
    const response = await axiosInstance.patch<IUser>(`${endpoints.users.byId(userId)}`, data, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

export const deleteUser = async (accessToken: string | undefined, userId: string) => {
    const response = await axiosInstance.delete<IUser>(`${endpoints.users.byId(userId)}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};
