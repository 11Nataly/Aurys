import api from "./api";

// Obtener lista de perfiles
export const listarPerfiles = async () => {
  const response = await api.get("/perfil/listar");
  return response.data;
};

// ✅ Actualizar perfil completo (nombre, correo, foto)
export const editarPerfil = async (usuarioId, { nombre, correo, foto }) => {
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("correo", correo);
  if (foto) formData.append("foto", foto);

  const response = await api.put(`/perfil/editar/${usuarioId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// ✅ Obtener foto (mostrar)
export const obtenerFotoPerfil = (nombreArchivo) =>
  `http://127.0.0.1:8000/perfil/foto/mostrar/${nombreArchivo}`;

export default { listarPerfiles, editarPerfil, obtenerFotoPerfil };
