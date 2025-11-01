// src/services/notasService.js
import api from "./api";

//===================================
// 🔹 Crear una nueva nota # Todo ese archivo realizado por douglas   
//===================================
export const crearNota = async (notaData) => {
  try {
    const response = await api.post("/diario/crear_diario", notaData);
    return response.data;
  } catch (err) {
    console.error("[servicio] crearNota error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error creando nota" };
  }
};

//===================================
// 🔹 Obtener notas por usuario
//===================================
export const obtenerNotasPorUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`diario/Nota_diario_usuario/${usuarioId}`);
    return response.data;
  } catch (err) {
    console.error("[servicio] obtenerNotasPorUsuario error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error obteniendo notas del usuario" };
  }
};
