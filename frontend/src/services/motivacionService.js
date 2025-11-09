// src/services/motivacionService.js
import api from "./api";

//===================================
//  Listar motivaciones activas del usuario logueado
//===================================
export const listarMotivaciones = async () => {
  try {
    const usuario_id = localStorage.getItem("id_usuario");

    if (!usuario_id) throw new Error("No se encontró id_usuario en localStorage");

    const response = await api.get(`/motivaciones/listar/${usuario_id}`);
    return response.data; // Devuelve las motivaciones activas del backend
  } catch (err) {
    console.error("[servicio] listarMotivaciones error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al listar motivaciones" };
  }
};

//===================================
//  Crear nueva motivación
//===================================
export const crearMotivacion = async (motivacionData) => {
  try {
    const formData = new FormData();
    formData.append("titulo", motivacionData.titulo);
    formData.append("descripcion", motivacionData.descripcion);
    formData.append("id_categoria", motivacionData.id_categoria);

    // 🔹 Tomamos usuario automáticamente del localStorage
    const usuario_id = localStorage.getItem("id_usuario");
    formData.append("id_usuario", usuario_id);

    if (motivacionData.imagen) {
      if (typeof motivacionData.imagen === "string" && motivacionData.imagen.startsWith("data:")) {
        const blob = await fetch(motivacionData.imagen).then((res) => res.blob());
        formData.append("imagen", blob, "imagen.jpg");
      } else if (motivacionData.imagen instanceof File) {
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
//  Cambiar estado favorita
//===================================
export const favoritosMotivacion = async (motivacion_id, favorita) => {
  try {
    const response = await api.put(
      `/motivaciones/${motivacion_id}/favorita?favorita=${favorita}`
    );
    return response.data;
  } catch (err) {
    console.error("[servicio] favoritosMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al cambiar estado favorito de motivación" };
  }
};


//===================================
//  Cambiar estado (soft delete)
//===================================
export const cambiarEstadoMotivacion = async (motivacion_id) => {
  try {
    // Siempre se envía estado=false (desactivar)
    const response = await api.put(`/motivaciones/${motivacion_id}/estado?estado=false`);
    return response.data;
  } catch (err) {
    console.error("[servicio] cambiarEstadoMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al desactivar motivación" };
  }
};