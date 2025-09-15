// src/Joven/JovenLayout.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Rutas internas del layout Joven
import Home from "./pages/Home";
import Diario from "./pages/Diario";
import KitEmergencia from "./pages/KitEmergencia";
import Promesas from "./pages/Promesas";

export default function JovenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* HEADER */}
      <Header />

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <Sidebar isOpen={sidebarOpen} />
        
        {/* CONTENIDO PRINCIPAL CON RUTAS INTERNAS */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="diario" element={<Diario />} />
            <Route path="kit-emergencia" element={<KitEmergencia />} />
            <Route path="promesas" element={<Promesas />} />
          </Routes>
        </main>
      </div>
      
      {/* FOOTER */}
      <Footer />
    </div>
  );
}