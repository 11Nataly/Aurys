import api from "./api";

// ✅ LOGIN
export const login = async (correo, contrasena) => {
  try {
    console.log("🔑 Iniciando sesión...");
    const response = await api.post("/auth/login", { correo, contrasena });

    if (response.data.access_token) {
      const rol = response.data.nombre_rol || response.data.rol || "usuario";
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("rol", rol);
      console.log("✅ Login correcto:", rol);

      // Redirigir por rol
      if (rol === "administrador") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/joven/home";
      }
    }

    return response.data; // ✅ devolver datos para el componente
  } catch (error) {
    console.error("❌ Error en login:", error);
    throw error;
  }
};

// ✅ REGISTER
export const register = async (usuarioData) => {
  try {
    console.log("📝 Registrando usuario:", usuarioData);
    const response = await api.post("/auth/register", usuarioData);
    console.log("✅ Registro completado:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error en registro:", error);
    throw error;
  }
};

// ✅ LOGOUT
export const logout = () => {
  console.log("🚪 Cerrando sesión...");
  ["token", "rol", "id_usuario", "nombre_usuario", "correo_usuario"].forEach((item) =>
    localStorage.removeItem(item)
  );
  window.location.href = "/landing";
};

// ✅ VERIFICAR AUTENTICACIÓN
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!(token && token !== "undefined" && token !== "null" && token.length > 10);
};

// ✅ OBTENER ROL
export const getUserRole = () => {
  return localStorage.getItem("rol") || "usuario";
};
