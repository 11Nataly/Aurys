// src/services/notasService.js
import api from "./api";

//===================================
// 🔹 Crear una nueva nota
//===================================
export const crearNota = async (notaData) => {
  try {
    const response = await api.post("/diario/crear", notaData);
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
    const response = await api.get(`diario/usuario/${usuarioId}`);
    return response.data;
  } catch (err) {
    console.error("[servicio] obtenerNotasPorUsuario error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error obteniendo notas del usuario" };
  }
};


// 🔹 Editar nota por ID
export const editarNota = async (id, notaData) => {
  try {
    const response = await api.put(`/diario/editar/${id}`, {
      titulo: notaData.titulo,
      contenido: notaData.contenido,
    });
    return response.data;
  } catch (err) {
    console.error("[servicio] editarNota error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error editando nota" };
  }
};


//===================================
// 🔹 Mover nota a papelera
//===================================
export const moverNotaAPapelera = async (id) => {
  try {
    const response = await api.put(`/diario/mover_papelera/${id}`);
    return response.data;
  } catch (err) {
    console.error("[servicio] moverNotaAPapelera error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error al mover la nota a la papelera" };
  }
};
