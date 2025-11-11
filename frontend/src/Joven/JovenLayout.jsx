import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";

import Home from "./pages/Home";
import Diario from "./pages/Diario";
import Afrontamiento from "./pages/Afrontamiento";
import KitEmergencia from "./pages/KitEmergencia";
import Promesas from "./pages/Promesas";
import Perfil from "./pages/Perfil";
import Papelera from "./pages/Papelera";
import MisMotivaciones from "./pages/MisMotivaciones";

export default function JovenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Siempre abierto por defecto
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 🔒 Validar autenticación
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  if (!token || rol !== "usuario") {
    console.log("🚫 Acceso denegado, redirigiendo al landing");
    return <Navigate to="/landing" replace />;
  }

  // Ajuste responsivo CORREGIDO
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // En móvil: cerrar sidebar por defecto
      // En desktop: abrir sidebar por defecto
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Ejecutar al montar el componente
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    console.log("Toggle sidebar:", !sidebarOpen); // Para debug
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => isMobile && setSidebarOpen(false);

  return (
    <div className={`main-layout ${sidebarOpen ? "has-sidebar" : "sidebar-collapsed"}`}>
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <div className="layout-body">
        <Sidebar isOpen={sidebarOpen} />
        {isMobile && sidebarOpen && (
          <div 
            className="sidebar-overlay-mobile" 
            onClick={closeSidebar} 
          />
        )}
        <div className={`main-content ${!sidebarOpen && !isMobile ? "sidebar-collapsed" : ""}`}>
          <Breadcrumb />
          <main className="page-content">
            <Routes>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="diario" element={<Diario />} />
              <Route path="afrontamiento" element={<Afrontamiento />} />
              <Route path="kit-emergencia" element={<KitEmergencia />} />
              <Route path="promesas" element={<Promesas />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="papelera" element={<Papelera />} />
              <Route path="kit-emergencia/mis-motivaciones" element={<MisMotivaciones />} />
              <Route path="*" element={<Navigate to="home" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}