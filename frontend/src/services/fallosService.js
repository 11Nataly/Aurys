// src/services/fallosService.js
import axios from "axios";

const API_URL = "http://localhost:8000/fallos";

export const registrarFallo = async (falloData) => {
  try {
    const response = await axios.post(`${API_URL}/`, falloData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el fallo:", error);
    throw error;
  }
};


// 🔹 Listar fallos por promesa
export const listarFallosPorPromesa = async (promesaId) => {
  const response = await axios.get(`${API_URL}/${promesaId}`);
  return response.data; // Lista de fallos
};

// 🔹 Eliminar fallo por ID
export const eliminarFallo = async (falloId) => {
  const response = await axios.delete(`${API_URL}/${falloId}`);
  return response.data;
};
