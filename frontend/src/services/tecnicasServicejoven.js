import api from "./api"; // tu instancia de axios

export const listarTecnicas = async () => {
  try {
    const id = localStorage.getItem("id_usuario"); // ID guardado al hacer login
    if (!id) throw new Error("ID de usuario no encontrado en localStorage");

    const response = await api.get(`/tecnicas/listar_tecnicas?usuario_id=${id}`);
    return response.data; // aquí llega un array de Técnicas
  } catch (err) {
    console.error("Error al cargar técnicas:", err);
    throw err;
  }
};

export const actualizarEstadoTecnica = async (tecnicaId, usuarioId, estrellas = null, favorita = null) => {
  try {
    const params = new URLSearchParams({ usuario_id: usuarioId });
    if (estrellas !== null) params.append("estrellas", estrellas);
    if (favorita !== null) params.append("favorita", favorita);

    const res = await api.put(`/tecnicas/actualizar_estado/${tecnicaId}?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Error actualizando estado de técnica:", error);
    throw error;
  }
};