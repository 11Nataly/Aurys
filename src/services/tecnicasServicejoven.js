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