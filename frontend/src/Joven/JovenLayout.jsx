// src/Joven/JovenLayout.jsx
import { useState, useEffect } from "react";
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
import Perfil from "./pages/Perfil";
import Papelera from "./pages/Papelera";
import MisMotivaciones from "./pages/MisMotivaciones";



export default function JovenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Estado inicial basado en el tamaño de pantalla
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
  });
  
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  // Efecto para detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // En desktop, asegurar que el sidebar esté abierto
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
      // En móvil, asegurar que el sidebar esté cerrado
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Limpiar el event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`main-layout ${sidebarOpen ? 'has-sidebar' : 'sidebar-collapsed'}`}>
      {/* HEADER */}
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

      <div className="layout-body">
        {/* SIDEBAR */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Overlay para móviles */}

        {isMobile && sidebarOpen && (

          <div 
            className="sidebar-overlay-mobile"
            onClick={closeSidebar}
          />
        )}

        {/* CONTENEDOR PRINCIPAL */}
        <div className={`main-content ${!sidebarOpen && !isMobile ? 'sidebar-collapsed' : ''}`}>
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
              <Route path="promesas" element={<Promesas />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="papelera" element={<Papelera />} />
              <Route path="kit-emergencia/mis-motivaciones" element={<MisMotivaciones />} />

            </Routes>
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}