// src/services/tecnicasService.js
import api from "./api";

// Crear técnica
export const crearTecnica = async (tecnicaData) => {
  const response = await api.post("/tecnicas/crear_tecnica", tecnicaData);
  return response.data;
};

// Subir video de una técnica
export const subirVideo = async (tecnicaId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/tecnicas/subir_video/${tecnicaId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Listar todas las técnicas
export const listarTecnicasAdmin = async () => {
  const response = await api.get("/tecnicas/todas_tecnicas");
  return response.data;
};


export const eliminarTecnica = async (id) => {
  try {
    const payload = { id: String(id) };     // enviar como string seguro
    console.log("[servicio] eliminarTecnica payload:", payload);

    const response = await api.delete("/tecnicas/eliminar_tecnica", {
      data: payload,
    });

    console.log("[servicio] eliminarTecnica response:", response.data);
    return response.data;
  } catch (err) {
    console.error("[servicio] eliminarTecnica error:", err.response?.data || err.message || err);
    // Normalizo el error para el frontend
    throw err.response?.data || { message: err.message || "Error eliminando técnica" };
  }
};