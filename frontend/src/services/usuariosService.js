// src/services/usuariosService.js
import api from "./api";

//===================================
// 🔹 Obtener todos los usuarios
//===================================
export const listarUsuarios = async () => {
  try {
    const response = await api.get("auth/listar_usuario_admin");
    return response.data;
  } catch (err) {
    console.error("[servicio] listarUsuarios error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error listando usuarios" };
  }
};

//===================================
// 🔹 Cambiar estado del usuario (activo ↔ inactivo)
//===================================
export const cambiarEstadoUsuario = async (id) => {
  try {
    console.log("[servicio] cambiarEstadoUsuario ID:", id);
    const response = await api.put(`/auth/cambiar_estado_usuario_admin/${id}`);
    return response.data;
  } catch (err) {
    console.error("[servicio] cambiarEstadoUsuario error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error cambiando estado del usuario" };
  }
};
