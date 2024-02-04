export async function loginWithIdToken(idToken: string | undefined) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_CREATEIFY_SERVICE_URL}/auth/sessionLogin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("An error occurred during login:", error);
        throw error;
    }
}
