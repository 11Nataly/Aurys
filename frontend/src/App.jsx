// src/App.jsx
import JovenLayout from "./Joven/JovenLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./InicioSesion/InicioSesion";
import Register from "./Registro/Registro";
import LandingPage from "./LandingPage/LandingPage";
import Admin from "./Admin/pages/Admin";
import RecuperarContraseña from "./InicioSesion/RecuperarContraseña"; // Importa el componente tempralmente para provar  se tiene que quitar
import  RegistroExitoso from "./Registro/RegistroExitoso"; // Importa el componente tempralmente para provar  se tiene que quitar

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección automática de / a /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Landing Page */}
        <Route path="/home" element={<LandingPage />} />
        
        {/* Login y Registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

         <Route path="/ver-recuperar" element={<RecuperarContraseña />} />
         <Route path="/ver-registroexitoso" element={<RegistroExitoso />} />
        
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Layout Joven con todas sus rutas internas */}
        <Route path="/joven/*" element={<JovenLayout />} />
      </Routes>
    </BrowserRouter>
  );
}