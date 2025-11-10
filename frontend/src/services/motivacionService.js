import api from "./api";

// 1. Listar motivaciones activas por usuario
export const listarMotivaciones = async () => {
  try {
    const usuario_id = localStorage.getItem("id_usuario");
    if (!usuario_id) throw new Error("No se encontró id_usuario en localStorage");

    // Corrección: Uso correcto de template literals con backticks (``)
    const response = await api.get(`/motivaciones/listar/${usuario_id}`);
    
    return response.data;
  } catch (err) {
    console.error("[servicio] listarMotivaciones error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al listar motivaciones" };
  }
};

// 2. Crear nueva motivación (multipart/form-data)
export const crearMotivacion = async (motivacionData) => {
  try {
    const formData = new FormData();
    formData.append("titulo", motivacionData.titulo);
    formData.append("descripcion", motivacionData.descripcion);
    formData.append("categoria_id", motivacionData.categoria_id);
    
    const usuario_id = localStorage.getItem("id_usuario");
    formData.append("usuario_id", usuario_id);
    
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

// 3. Editar motivación (texto y categoría) - puedes usar FormData o JSON según backend
export const editarMotivacion = async (motivacion_id, motivacionData) => {
  try {
    // Usamos JSON para editar texto/categoría
    const payload = {
      titulo: motivacionData.titulo,
      descripcion: motivacionData.descripcion,
      categoria_id: motivacionData.categoria_id,
      usuario_id: localStorage.getItem("id_usuario"),
    };
    
    // Corrección: Uso correcto de template literals con backticks (``)
    const response = await api.put(`/motivaciones/${motivacion_id}/editar`, payload);
    
    return response.data;
  } catch (err) {
    console.error("[servicio] editarMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al editar motivación" };
  }
};

// 3.1 Editar imagen (multipart/form-data) -> PUT /motivaciones/{id}/editar-imagen
export const editarImagenMotivacion = async (motivacion_id, archivoImagen) => {
  try {
    const formData = new FormData();
    formData.append("imagen", archivoImagen);
    
    // Corrección: Uso correcto de template literals con backticks (``)
    const response = await api.put(`/motivaciones/${motivacion_id}/editar-imagen`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    return response.data;
  } catch (err) {
    console.error("[servicio] editarImagenMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al editar imagen de motivación" };
  }
};

// favoritos, estado y eliminar (mantén tus implementaciones previas)
export const favoritosMotivacion = async (motivacion_id, favorita) => {
  try {
    // Corrección: Uso correcto de template literals con backticks (``)
    const response = await api.put(`/motivaciones/${motivacion_id}/favorita?favorita=${favorita}`);
    
    return response.data;
  } catch (err) {
    console.error("[servicio] favoritosMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al cambiar favorita" };
  }
};

export const cambiarEstadoMotivacion = async (motivacion_id, estado = false) => {
  try {
    // Corrección: Uso correcto de template literals con backticks (``)
    const response = await api.put(`/motivaciones/${motivacion_id}/estado?estado=${estado}`);
    
    return response.data;
  } catch (err) {
    console.error("[servicio] cambiarEstadoMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al cambiar estado de motivación" };
  }
};

export const eliminarMotivacion = async (motivacion_id) => {
  try {
    // Corrección: Uso correcto de template literals con backticks (``)
    const response = await api.delete(`/motivaciones/${motivacion_id}`);
    
    return response.data;
  } catch (err) {
    console.error("[servicio] eliminarMotivacion error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Error al eliminar motivación" };
  }
};