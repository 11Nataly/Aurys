// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Aquí verificamos si el usuario tiene sesión activa
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no está autenticado, redirigimos al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza la ruta solicitada
  return children;
}