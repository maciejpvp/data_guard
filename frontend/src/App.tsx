import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import { useAuthStore } from "./store/authStore";

import { IndexPage } from "@/pages/index";
import { LoginPage } from "@/pages/login";
import { CallbackPage } from "@/pages/callback";

function App() {
  const login = useAuthStore((store) => store.login);

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

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<CallbackPage />} path="/callback" />
      <Route element={<Navigate to="/login" />} path="*" />
    </Routes>
  );
}

export default App;
