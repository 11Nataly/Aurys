import api from "./api";

// ✅ LOGIN
export const login = async (correo, contrasena) => {
  try {
    console.log("🔑 Iniciando sesión...");
    const response = await api.post("/auth/login", { correo, contrasena });
    const data = response.data;

    // 🧠 Guardar todos los datos necesarios en localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("id_usuario", data.id); // ✅ Guarda el ID correctamente
    localStorage.setItem("rol", data.nombre_rol);

    console.log("✅ Login correcto:", {
      id_usuario: data.id,
      rol: data.nombre_rol,
    });

    // 🔀 Redirección según el rol
    if (data.nombre_rol === "administrador") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/joven/home";
    }

    return data;
  } catch (error) {
    console.error("❌ Error en login:", error);
    throw error;
  }
};

// ✅ REGISTER
export const register = async (usuarioData) => {
  try {
    const response = await api.post("/auth/register", usuarioData);
    return response.data;
  } catch (error) {
    console.error("❌ Error en registro:", error);
    throw error;
  }
};

// ✅ LOGOUT
export const logout = () => {
  console.log("🚪 Cerrando sesión...");
  ["token", "rol", "id_usuario"].forEach((item) =>
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
