import api from "./api";

// ✅ Actualizar datos del perfil (nombre, correo, contraseña)
export const actualizarPerfil = async (usuarioId, data) => {
  try {
    // Filtrar campos vacíos o undefined
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined && value !== null)
    );

    console.log("📤 Enviando datos filtrados:", filteredData);

    const response = await api.put(`/perfil/actualizar/${usuarioId}`, filteredData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error en actualizarPerfil:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Actualizar solo la foto de perfil
export const actualizarFoto = async (usuarioId, foto) => {
  const formData = new FormData();
  if (foto) formData.append("file", foto);

  try {
    const response = await api.put(`/perfil/foto/${usuarioId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error en actualizarFoto:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Editar perfil completo (nombre, correo, foto)
export const editarPerfil = async (usuarioId, { nombre, correo, foto }) => {
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("correo", correo);
  if (foto) formData.append("foto", foto);

  try {
    const response = await api.put(`/perfil/editar/${usuarioId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error en editarPerfil:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Listar perfiles
export const listarPerfiles = async () => {
  const response = await api.get("/perfil/listar");
  return response.data;
};

export default {
  actualizarPerfil,
  actualizarFoto,
  editarPerfil,
  listarPerfiles,
};