import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
    baseURL: "https://accounts.iisu.network", // Change base URL
    fetchOptions: {
        auth: {
            type: "Bearer",
            token: () => localStorage.getItem("auth_token") || "",
        },
    },
});

export const getBadges = async () => {
    const response = await fetch("https://accounts.iisu.network/me/badges", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch badges");
    }

    return (await response.json()).badges as string[];
};