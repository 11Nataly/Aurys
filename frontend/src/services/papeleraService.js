// =============================================
// 🔹 Servicio: Papelera
// Archivo: src/services/papeleraService.js
// =============================================
import api from "./api";

// ===============================
// 🔸 Obtener Promesas en Papelera
// ===============================
export const obtenerPromesasPapelera = async (usuarioId) => {
  try {
    const response = await api.get(`/promesas/listar/${usuarioId}`);
    // Filtra las que estén inactivas (activo == false o 0)
    return response.data.filter((p) => !p.activo);
  } catch (err) {
    console.error("[servicio] obtenerPromesasPapelera error:", err.response?.data || err);
    throw err.response?.data || { message: err.message || "Error al obtener promesas en papelera" };
  }
};

// ===============================
// 🔸 Obtener Notas de Diario en Papelera
// ===============================
export const obtenerNotasPapelera = async (usuarioId) => {
  try {
    const response = await api.get(`/diario/listar/${usuarioId}`);
    return response.data.filter((n) => !n.activo);
  } catch (err) {
    console.error("[servicio] obtenerNotasPapelera error:", err.response?.data || err);
    throw err.response?.data || { message: err.message || "Error al obtener notas en papelera" };
  }
};

// ===============================
// 🔸 Obtener Motivaciones en Papelera
// ===============================
export const obtenerMotivacionesPapelera = async (usuarioId) => {
  try {
    const response = await api.get(`/motivaciones/listar/${usuarioId}`);
    return response.data.filter((m) => !m.activo);
  } catch (err) {
    console.error("[servicio] obtenerMotivacionesPapelera error:", err.response?.data || err);
    throw err.response?.data || { message: err.message || "Error al obtener motivaciones" };
  }
};

// ===============================
// 🔸 Restaurar elemento (poner activo = true)
// ===============================
export const restaurarElemento = async (tipo, id) => {
  try {
    let response;
    switch (tipo) {
      case "Promesas":
        response = await api.put(`/promesas/${id}/estado?estado=true`);
        break;
      case "Entradas de Diario":
        response = await api.put(`/diario/${id}/estado?estado=true`);
        break;
      case "Motivaciones":
        response = await api.put(`/motivaciones/${id}/estado?estado=true`);
        break;
      default:
        throw new Error("Tipo de elemento no reconocido");
    }
    return response.data;
  } catch (err) {
    console.error("[servicio] restaurarElemento error:", err.response?.data || err);
    throw err.response?.data || { message: err.message || "Error al restaurar elemento" };
  }
};

// ===============================
// 🔸 Eliminar definitivamente
// ===============================
export const eliminarDefinitivo = async (tipo, id) => {
  try {
    let response;
    switch (tipo) {
      case "Promesas":
        response = await api.delete(`/promesas/${id}`);
        break;
      case "Entradas de Diario":
        response = await api.delete(`/diario/${id}`);
        break;
      case "Motivaciones":
        response = await api.delete(`/motivaciones/${id}`);
        break;
      default:
        throw new Error("Tipo de elemento no reconocido");
    }
    return response.data;
  } catch (err) {
    console.error("[servicio] eliminarDefinitivo error:", err.response?.data || err);
    throw err.response?.data || { message: err.message || "Error al eliminar elemento" };
  }
};
