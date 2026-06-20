import { type Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: "e6908c0f-db0f-4453-8837-00f542f9bfb6", 
        authority: "https://login.microsoftonline.com/organizations", 
        redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI || "http://localhost:3001", 
    },
    cache: {
        cacheLocation: "sessionStorage"
    }
};