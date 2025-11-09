// src/App.jsx
import JovenLayout from "./Joven/JovenLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./InicioSesion/InicioSesion";
import Register from "./Registro/Registro";
import LandingPage from "./LandingPage/LandingPage";
import Admin from "./Admin/pages/Admin";

import RecuperarContraseña from "./InicioSesion/RecuperarContraseña";
import RegistroExitoso from "./Registro/RegistroExitoso";
import EnviarCorreoCard from "./InicioSesion/EnviarCorreo";
import ProtectedRoute from "./ProtectedRoute";
import AdminPerfil from "./Admin/pages/AdminPerfil";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección automática de / a /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Páginas públicas */}
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🟢 Rutas de recuperación de contraseña */}
        <Route path="/login/recuperar" element={<EnviarCorreoCard />} />
        {/* Aquí se mantiene el nombre pero se agrega el token */}
        <Route path="/ver-recuperar/:token" element={<RecuperarContraseña />} />

        {/* Confirmación de registro */}
        <Route path="/ver-registroexitoso" element={<RegistroExitoso />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joven/*"
          element={
            <ProtectedRoute>
              <JovenLayout />
            </ProtectedRoute>
          }
        />

         <Route path="/ver-recuperar" element={<RecuperarContraseña />} />
         <Route path="/login/recuperar" element={<EnviarCorreoCard />} />
         <Route path="/ver-registroexitoso" element={<RegistroExitoso />} />
        
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="admin/perfil" element={<AdminPerfil />} />
     
      </Routes>
    </BrowserRouter>
  );
}
