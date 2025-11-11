import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../src/services/authService";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  console.log("🧭 PublicRoute: verificando autenticación...");

  if (isAuthenticated() && token) {
    console.log(`🧭 Usuario autenticado (${rol}), redirigiendo...`);
    if (rol === "administrador") return <Navigate to="/admin" replace />;
    return <Navigate to="/joven/home" replace />;
  }

  return children;
}
