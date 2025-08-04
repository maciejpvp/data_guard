import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "@/pages/login";
import { CallbackPage } from "@/pages/callback";

function App() {
  return (
    <Routes>
      <Route element={<Navigate to="/login" />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<CallbackPage />} path="/callback" />
      <Route element={<Navigate to="/login" />} path="*" />
    </Routes>
  );
}

export default App;
