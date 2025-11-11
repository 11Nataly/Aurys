import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

export default function PrivateRoute({ rol, children }) {
  const token = localStorage.getItem("token");
  const userRol = localStorage.getItem("rol");
  const location = useLocation();

  // No autenticado
  if (!isAuthenticated() || !token) {
    console.log("🔒 Usuario no autenticado, redirigiendo a /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rol incorrecto
  if (rol && userRol !== rol) {
    console.warn(`⚠️ Rol incorrecto. Esperado: ${rol}, actual: ${userRol}`);
    if (userRol === "administrador") return <Navigate to="/admin" replace />;
    return <Navigate to="/joven/home" replace />;
  }

  // Autorizado
  return children;
}
