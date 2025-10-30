// src/services/categoriaService.js
import api from "./api";

//===================================
//  Crear una nueva categoría
//===================================
export const crearCategoria = async (categoriaData) => {
  try {
    const response = await api.post("/categorias/agregar", categoriaData);
    return response.data;
  } catch (err) {
    console.error("[servicio] crearCategoria error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error creando categoría" };
  }
};

