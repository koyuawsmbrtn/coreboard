import { createAuthClient } from "better-auth/svelte";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { username } from "better-auth/plugins"

export const authClient = createAuthClient({
    baseURL: PUBLIC_BASE_URL,
    fetchOptions: {
        auth: {
            type: "Bearer",
            token: () => localStorage.getItem("auth_token") || "",
        },
    },
    plugins: [username()],
});

export const getBadges = async () => {
    const response = await fetch(`${PUBLIC_BASE_URL}/me/badges`, {
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