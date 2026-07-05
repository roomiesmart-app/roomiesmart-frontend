import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/routes/App";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const KINDE_CLIENT_ID = import.meta.env.VITE_KINDE_CLIENT_ID;
const KINDE_ISSUER_URL = import.meta.env.VITE_KINDE_ISSUER_URL;
const KINDE_REDIRECT_URL = import.meta.env.VITE_KINDE_POST_LOGIN_REDIRECT_URL;
const KINDE_LOGOUT_URL = import.meta.env.VITE_KINDE_POST_LOGOUT_REDIRECT_URL;

if (!KINDE_CLIENT_ID || !KINDE_ISSUER_URL) {
  throw new Error("Missing Kinde Environment Variables");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KindeProvider
      clientId={KINDE_CLIENT_ID}
      domain={KINDE_ISSUER_URL}
      redirectUri={KINDE_REDIRECT_URL}
      logoutUri={KINDE_LOGOUT_URL}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </KindeProvider>
  </React.StrictMode>,
);
