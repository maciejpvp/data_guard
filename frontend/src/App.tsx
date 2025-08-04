import { Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/login";

import IndexPage from "@/pages/index";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
    </Routes>
  );
}

export default App;
