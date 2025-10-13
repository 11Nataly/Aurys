// src/Joven/JovenLayout.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Rutas internas del layout Joven
import Home from "./pages/Home";
import Diario from "./pages/Diario";
import Afrontamiento from "./pages/Afrontamiento";
import KitEmergencia from "./pages/KitEmergencia";
import Promesas from "./pages/Promesas";

// ✅ Importa la Papelera
import TrashSection from "../Joven/components/Papelera/TrashSection";

export default function JovenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`main-layout ${sidebarOpen ? "has-sidebar" : "sidebar-collapsed"}`}>
      {/* HEADER con control del sidebar */}
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

      <div className="layout-body">
        {/* SIDEBAR */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Overlay para móviles */}
        {sidebarOpen && <div className="sidebar-overlay-mobile" onClick={closeSidebar} />}

        {/* CONTENEDOR PRINCIPAL */}
        <div className={`main-content ${!sidebarOpen ? "sidebar-collapsed" : ""}`}>
          <main className="page-content">
            <Routes>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="diario" element={<Diario />} />
              <Route path="afrontamiento" element={<Afrontamiento />} />
              <Route path="kit-emergencia" element={<KitEmergencia />} />
              <Route path="kit-emergencia/afrontamiento" element={<Afrontamiento />} />
              <Route path="promesas" element={<Promesas />} />

              {/* ✅ Nueva ruta: Papelera */}
              <Route path="papelera" element={<TrashSection />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
