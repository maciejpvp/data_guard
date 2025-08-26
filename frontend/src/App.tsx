import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useAuthStore } from "./store/authStore";

import { IndexPage } from "@/pages/index";
import { LoginPage } from "@/pages/login";
import { CallbackPage } from "@/pages/callback";
import { SettingsPage } from "./pages/settings";
import { useWebSocketStore } from "./store/wsStore";
import { websocketUrl } from "./constants/ws";

function App() {
  const login = useAuthStore((store) => store.login);

  const idToken = useAuthStore((store) => store.idToken);

  const connectWS = useWebSocketStore((store) => store.connect);
  const disconnectWS = useWebSocketStore((store) => store.disconnect);
  const isConnected = useWebSocketStore((store) => store.connected);

  useEffect(() => {
    login();

    const refreshId = setTimeout(
      () => {
        login();
      },
      59 * 60 * 1000, // 59 Min
    );

    return () => {
      clearTimeout(refreshId);
    };
  }, []);

  useEffect(() => {
    if (!idToken) return;
    if (isConnected) return;

    connectWS(websocketUrl());

    return () => {
      disconnectWS();
    };
  }, [idToken, isConnected]);

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<CallbackPage />} path="/callback" />
      <Route element={<SettingsPage />} path="/settings" />
      <Route element={<Navigate to="/login" />} path="*" />
    </Routes>
  );
}

export default App;
