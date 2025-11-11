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

//===================================
//  Listar categorías por usuario
//===================================
export const listarCategorias = async (usuario_id) => {
  try {
    const response = await api.get(`/categorias/listar/${usuario_id}`);
    return response.data;
  } catch (err) {
    console.error("[servicio] listarCategorias error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al listar categorías" };
  }
};

//===================================
//  Listar nombres de categorías activas
//===================================
export const listarCategoriasActivas = async (usuario_id) => {
  try {
    const response = await api.get(`/categorias/${usuario_id}/activas`);
    return response.data;
  } catch (err) {
    console.error("[servicio] listarCategoriasActivas error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al obtener categorías activas" };
  }
};


//===================================
//  Cambiar estado de una categoría (activar/desactivar)
//===================================
export const cambiarEstadoCategoria = async (categoria_id, nuevoEstado) => {
  try {
    const response = await api.put(`/categorias/${categoria_id}/estado`, {
      activo: nuevoEstado,
    });
    return response.data;
  } catch (err) {
    console.error("[servicio] cambiarEstadoCategoria error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error cambiando estado de categoría" };
  }
};
