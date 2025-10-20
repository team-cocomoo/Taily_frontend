// src/App.jsx
import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthProvider from "@/contexts/AuthProvider";

// 분리된 라우트 파일 import
import UserRoutes from "@/routes/UserRoutes";
import AdminRoutes from "@/routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {UserRoutes}

          {AdminRoutes}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
