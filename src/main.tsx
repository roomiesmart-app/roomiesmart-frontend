import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/routes/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { RoomieProvider } from "./contexts/roomie/RoomieContext";
import { msalConfig } from "./config/authConfig";

const queryClient = new QueryClient();
const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  msalInstance.handleRedirectPromise().catch((e) => console.error(e));

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <QueryClientProvider client={queryClient}>
          <RoomieProvider>
            <App />
          </RoomieProvider>
        </QueryClientProvider>
      </MsalProvider>
    </React.StrictMode>,
  );
});
