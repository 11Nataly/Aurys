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

export default function JovenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`main-layout ${sidebarOpen ? 'has-sidebar' : 'sidebar-collapsed'}`}>
      {/* HEADER (fijo) */}
      <Header />

      <div className="layout-body">
        {/* SIDEBAR */}
        <Sidebar isOpen={sidebarOpen} />

        {/* CONTENEDOR PRINCIPAL */}
        <div className={`main-content ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
          <main className="page-content">
            <Routes>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="diario" element={<Diario />} />
              <Route path="afrontamiento" element={<Afrontamiento />} />
              <Route path="kit-emergencia" element={<KitEmergencia />} />
              <Route path="promesas" element={<Promesas />} />
            </Routes>
          </main>
        </div>
      </div>
      
      {/* FOOTER FUERA del flex container para controlar márgenes */}
      <Footer />
    </div>
  );
}