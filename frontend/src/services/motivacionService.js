// src/services/motivacionService.js
import api from "./api";

//===================================
//  Listar motivaciones por usuario
//===================================
export const listarMotivaciones = async (usuario_id) => {
  try {
    const response = await api.get(`/motivaciones/listar/${usuario_id}`);
    return response.data;
  } catch (err) {
    console.error("[servicio] listarMotivaciones error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al listar motivaciones" };
  }
};

//===================================
//  Crear nueva motivación
//===================================

// se cambio para enviar la petición con un FormData() porque el backend usó multipart/form-data en lugar de un json
export const crearMotivacion = async (motivacionData) => {
  try {
    const formData = new FormData();
    formData.append("titulo", motivacionData.titulo);
    formData.append("descripcion", motivacionData.descripcion);
    formData.append("id_categoria", motivacionData.id_categoria);
    formData.append("id_usuario", motivacionData.id_usuario);

    // 🔥 Imagen: acepta File o Base64
    if (motivacionData.imagen) {
      if (typeof motivacionData.imagen === "string" && motivacionData.imagen.startsWith("data:")) {
        // Si es base64 → convertir a blob
        const blob = await fetch(motivacionData.imagen).then((res) => res.blob());
        formData.append("imagen", blob, "imagen.jpg");
      } else if (motivacionData.imagen instanceof File) {
        // Si es un archivo directo del input
        formData.append("imagen", motivacionData.imagen);
      }
    }

    const response = await api.post("/motivaciones/agregar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (err) {
    console.error("[servicio] crearMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al crear motivación" };
  }
};


//===================================
//  Marcar o desmarcar como favorita
//===================================
export const cambiarFavorita = async (motivacion_id) => {
  try {
    const response = await api.put(`/motivaciones/${motivacion_id}/favorita`);
    return response.data;
  } catch (err) {
    console.error("[servicio] cambiarFavorita error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al cambiar favorita" };
  }
};

//===================================
//  Editar motivación existente
//===================================
export const editarMotivacion = async (motivacion_id, motivacionData) => {
  try {
    const response = await api.put(`/motivaciones/${motivacion_id}/editar`, motivacionData);
    return response.data;
  } catch (err) {
    console.error("[servicio] editarMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al editar motivación" };
  }
};

//===================================
//  Cambiar estado (activar/desactivar)
//===================================
export const cambiarEstadoMotivacion = async (motivacion_id) => {
  try {
    const response = await api.put(`/motivaciones/${motivacion_id}/estado`);
    return response.data;
  } catch (err) {
    console.error("[servicio] cambiarEstadoMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al cambiar estado de motivación" };
  }
};
