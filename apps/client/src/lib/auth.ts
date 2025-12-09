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