import JovenLayout from "./Joven/JovenLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./InicioSesion/InicioSesion";
import Register from "./Registro/Registro";
import LandingPage from "./LandingPage/LandingPage";
import Admin from "./Admin/pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page como página principal */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        
        {/* Login y Registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Layout Joven con todas sus rutas internas */}
        <Route path="/joven/*" element={<JovenLayout />} />
      </Routes>
    </BrowserRouter>
  );
}