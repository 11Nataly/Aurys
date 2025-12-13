// src/services/promesaService.js
import api from "./api";

/**
 * Listar promesas activas del usuario
 * GET /promesas/listar/{usuario_id}
 */
export const listarPromesas = async (usuarioId) => {
  const { data } = await api.get(`/promesas/listar/${usuarioId}`);
  return data;
};

/**
 * Crear una nueva promesa
 * POST /promesas/agregar
 */
export const crearPromesa = async (promesaData) => {
  const { data } = await api.post(`/promesas/agregar`, promesaData);
  return data;
};

/**
 * Editar una promesa
 * PUT /promesas/{promesa_id}
 */
export const editarPromesa = async (promesaId, datosActualizados) => {
  const { data } = await api.put(
    `/promesas/${promesaId}`,
    datosActualizados
  );
  return data;
};

/**
 * Marcar promesa como cumplida o no cumplida
 * PUT /promesas/{promesa_id}/cumplida
 */
export const cambiarEstadoCumplida = async (promesaId, cumplida) => {
  const { data } = await api.put(
    `/promesas/${promesaId}/cumplida`,
    null,
    {
      params: { cumplida },
    }
  );
  return data;
};

/**
 * Mover promesa a papelera
 * PUT /promesas/{promesa_id}/papelera
 */
export const moverAPapelera = async (promesaId) => {
  const { data } = await api.put(
    `/promesas/${promesaId}/papelera`
  );
  return data;
};

/**
 * Eliminar promesa definitivamente
 * DELETE /promesas/{promesa_id}
 */
export const eliminarPromesa = async (promesaId) => {
  const { data } = await api.delete(`/promesas/${promesaId}`);
  return data;
};
