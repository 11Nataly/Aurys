// src/services/fallosService.js
import axios from "axios";

const API_URL = "http://localhost:8000/fallos";

export const registrarFallo = async (falloData) => {
  try {
    const response = await axios.post(`${API_URL}/`, falloData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el fallo:", error.response?.data || error.message);
    throw error;
  }
};

export const listarFallosPorPromesa = async (promesaId) => {
  const response = await axios.get(`${API_URL}/promesa/${promesaId}`);
  return response.data;
};

export const eliminarFallo = async (falloId) => {
  const response = await axios.delete(`${API_URL}/${falloId}`);
  return response.data;
};