// src/Joven/JovenLayout.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";

// Páginas del layout
import Home from "./pages/Home";
import Diario from "./pages/Diario";
import Afrontamiento from "./pages/Afrontamiento";
import KitEmergencia from "./pages/KitEmergencia";
import Promesas from "./pages/Promesas";
import MisMotivaciones from "./pages/MisMotivaciones";

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
      {/* HEADER */}
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

      <div className="layout-body">
        {/* SIDEBAR */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Overlay para móviles */}
        {sidebarOpen && <div className="sidebar-overlay-mobile" onClick={closeSidebar} />}

        {/* CONTENEDOR PRINCIPAL */}
        <div className={`main-content ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
          {/* MIGA DE PAN */}
          <Breadcrumb />

          {/* CONTENIDO DE LA PÁGINA */}
          <main className="page-content">
            <Routes>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="diario" element={<Diario />} />
              <Route path="afrontamiento" element={<Afrontamiento />} />
              <Route path="kit-emergencia" element={<KitEmergencia />} />
              <Route path="kit-emergencia/afrontamiento" element={<Afrontamiento />} />
              <Route path="kit-emergencia/mis-motivaciones" element={<MisMotivaciones />} />
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
