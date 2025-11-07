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

//===============
// Listar técnica # Todo ese archivo realizado por douglas   
//===============


export const listarTecnicasAdmin = async () => {
  const response = await api.get("/tecnicas/todas_tecnicas");
  return response.data;
};


//===============
// Eliminar técnica
//===============


export const eliminarTecnica = async (id) => {
  try {
    const payload = { id: id }; // 👈 mantener como número
    console.log("[servicio] eliminarTecnica payload:", payload);

    const response = await api.delete("/tecnicas/eliminar_tecnica", {
      data: payload,
    });

    console.log("[servicio] eliminarTecnica response:", response.data);
    return response.data;
  } catch (err) {
    console.error("[servicio] eliminarTecnica error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error eliminando técnica" };
  }
};



//===============
// Editar técnica
//===============


export const editarTecnica = async (tecnicaData) => {
  try {
    console.log("[servicio] editarTecnica payload:", tecnicaData);

    const response = await api.put("/tecnicas/actualizar_tecnica", tecnicaData);

    console.log("[servicio] editarTecnica response:", response.data);
    return response.data;
  } catch (err) {
    console.error("[servicio] editarTecnica error:", err.response?.data || err.message || err);
    throw err.response?.data || { message: err.message || "Error editando técnica" };
  }
};