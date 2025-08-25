import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { SettingsPage } from "./pages/settings";
import { useAuthStore } from "./store/authStore";
import { useWebSocketStore } from "./store/wsStore";

import { CallbackPage } from "@/pages/callback";
import { IndexPage } from "@/pages/index";
import { LoginPage } from "@/pages/login";
import { websocketUrl } from "./constants/ws";

function App() {
  const login = useAuthStore((store) => store.login);
  const token = useAuthStore((store) => store.idToken);

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
    if (!token) return;
    if (isConnected) return;

    connectWS(websocketUrl());

    return () => {
      disconnectWS();
    };
  }, [token, isConnected]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<CallbackPage />} path="/callback" />
        <Route element={<SettingsPage />} path="/settings" />
        <Route element={<Navigate to="/login" />} path="*" />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
