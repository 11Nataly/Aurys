import api from "./api";
export const login = async (correo, contrasena) => {
  const response = await api.post("/auth/login", { correo, contrasena });
  return response.data; // { access_token, token_type }
};

// Registro
export const register = async (usuarioData) => {
  const response = await api.post("/auth/register", usuarioData);
  return response.data;
};