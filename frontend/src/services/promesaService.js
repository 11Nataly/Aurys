// src/services/promesaService.js
import axios from "axios";

const API_URL = "http://localhost:8000/promesas";

export const listarPromesas = async (usuarioId) => {
  const response = await axios.get(`${API_URL}/listar/${usuarioId}`);
  return response.data;
};

export const crearPromesa = async (promesaData) => {
  const response = await axios.post(`${API_URL}/agregar`, promesaData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const editarPromesa = async (promesaId, datosActualizados) => {
  const response = await axios.put(`${API_URL}/${promesaId}`, datosActualizados, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const cambiarEstadoCumplida = async (promesaId, cumplida) => {
  const response = await axios.put(`${API_URL}/${promesaId}/cumplida`, null, {
    params: { cumplida },
  });
  return response.data;
};

export const moverAPapelera = async (promesaId, activo) => {
  const response = await axios.put(`${API_URL}/${promesaId}/papelera`, { activo }, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const eliminarPromesa = async (promesaId) => {
  return await moverAPapelera(promesaId, false);
};