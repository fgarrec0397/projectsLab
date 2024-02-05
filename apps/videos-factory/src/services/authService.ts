import axios from "axios";

import { endpoints } from "@/routes/endpoints";

export async function sessionLogin(idToken: string | undefined) {
    try {
        return await axios.post(
            endpoints.auth.login,
            { idToken },
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error;
    }
}

export async function sessionLogout() {
    try {
        return await axios.post(endpoints.auth.logout, undefined, {
            method: "POST",
            withCredentials: true,
        });
    } catch (error) {
        console.error("Logout error:", error);
    }
}
