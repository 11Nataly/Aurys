import axios from "axios";

const API_URL = "http://127.0.0.1:8000/promesas";

// 🔹 Obtener todas las promesas de un usuario
export const listarPromesas = async (usuarioId) => {
  const response = await axios.get(`${API_URL}/listar/${usuarioId}`);
  return response.data;
};

// 🔹 Crear una nueva promesa
export const crearPromesa = async (promesaData) => {
  const response = await axios.post(`${API_URL}/agregar`, promesaData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// 🔹 Editar promesa por ID
export const editarPromesa = async (promesaId, datosActualizados) => {
  const response = await axios.put(`${API_URL}/${promesaId}`, datosActualizados, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// 🔹 Marcar promesa como cumplida o no cumplida
export const cambiarEstadoCumplida = async (promesaId, cumplida) => {
  const response = await axios.put(`${API_URL}/${promesaId}/cumplida?cumplida=${cumplida}`);
  return response.data;
};

// 🔹 Mover o restaurar promesa en papelera
export const moverAPapelera = async (promesaId, activo) => {
  const response = await axios.put(`${API_URL}/${promesaId}/papelera`, { activo });
  return response.data;
};

// 🔹 Enviar promesa a la papelera (en lugar de eliminarla)
export const eliminarPromesa = async (promesaId) => {
  const response = await axios.put(`${API_URL}/${promesaId}/papelera`, { activo: false });
  return response.data;
};
