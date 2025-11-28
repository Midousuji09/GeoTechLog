// App.tsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 👇 Auth pages
import Login from "./components/Login";
import RegisterPage from "./components/Register";

// 👇 App pages
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Info from "./pages/Info";
import Contacto from "./pages/Contacto";
import Configuracion from "./pages/Configuracion";
import VisitanteDashboard from "./pages/VisitanteDashboard";

import Navbar from "./components/Navbar";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 👉 Ocultar navbar en Login y Register
  const hideNavbarPaths = ["/", "/register"];
  const currentPath = window.location.pathname;
  const showNavbar = !hideNavbarPaths.includes(currentPath);

  return (
    <BrowserRouter>
      {/* 🔝 Mostrar Navbar solo cuando no estemos en Login o Register */}
      {showNavbar && (
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
      )}

      <Routes>
        {/* 🔐 Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🧭 App */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              sidebarOpen={sidebarOpen}
              onSidebarClose={() => setSidebarOpen(false)}
            />
          }
        />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/info" element={<Info />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/visitante" element={<VisitanteDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
