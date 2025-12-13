// src/services/fallosService.js
import api from "./api";

/**
 * Registrar un fallo
 * POST /fallos/
 */
export const registrarFallo = async (falloData) => {
  const { data } = await api.post("/fallos/", falloData);
  return data;
};

/**
 * Listar fallos de una promesa
 * GET /fallos/{promesa_id}
 */
export const listarFallosPorPromesa = async (promesaId) => {
  const { data } = await api.get(`/fallos/${promesaId}`);
  return data;
};

/**
 * Eliminar un fallo
 * DELETE /fallos/{fallo_id}
 */
export const eliminarFallo = async (falloId) => {
  const { data } = await api.delete(`/fallos/${falloId}`);
  return data;
};
