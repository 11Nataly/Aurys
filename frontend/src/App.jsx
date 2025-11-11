import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./LandingPage/LandingPage";
import Login from "./InicioSesion/InicioSesion";
import Register from "./Registro/Registro";
import EnviarCorreoCard from "./InicioSesion/EnviarCorreo";
import RecuperarContraseña from "./InicioSesion/RecuperarContraseña";
import RegistroExitoso from "./Registro/RegistroExitoso";
import JovenLayout from "./Joven/JovenLayout";
import Admin from "./Admin/pages/Admin";
import AdminPerfil from "./Admin/pages/AdminPerfil";

import PrivateRoute from "./InicioSesion/Privaterouter";
import PublicRoute from "./PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* LANDING */}
        <Route path="/landing" element={<LandingPage />} />

        {/* PÚBLICAS */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login/recuperar"
          element={
            <PublicRoute>
              <EnviarCorreoCard />
            </PublicRoute>
          }
        />
        <Route
          path="/ver-recuperar/:token"
          element={
            <PublicRoute>
              <RecuperarContraseña />
            </PublicRoute>
          }
        />
        <Route
          path="/ver-registroexitoso"
          element={
            <PublicRoute>
              <RegistroExitoso />
            </PublicRoute>
          }
        />

        {/* PRIVADAS */}
        <Route
          path="/joven/*"
          element={
            <PrivateRoute rol="usuario">
              <JovenLayout />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute rol="administrador">
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <PrivateRoute rol="administrador">
              <AdminPerfil />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
