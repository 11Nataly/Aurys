import api from './api'; 
// api.js debe tener la configuración base de Axios (por ejemplo: baseURL y headers por defecto)

/**
 * Paso 1️⃣ - Enviar correo de recuperación
 * Llama al endpoint /recuperar-contrasena
 */
export const recuperarContrasena = async (correo) => {
  try {
    const response = await api.post('/recuperar-contrasena', { correo });
    return response.data; // { msg: "Te hemos enviado un correo para recuperar tu contraseña." }
  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    throw error.response?.data || { message: 'Error al enviar el correo' };
  }
};

/**
 * Paso 2️⃣ - Restablecer contraseña usando el token del enlace enviado al correo
 * Llama al endpoint /restablecer-contrasena/{token}
 */
export const restablecerContrasena = async (token, nuevaContrasena) => {
  try {
    const response = await api.post(`/restablecer-contrasena/${token}`, {
      nueva_contrasena: nuevaContrasena,
    });
    return response.data; // { msg: "Contraseña restablecida con éxito." }
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    throw error.response?.data || { message: 'Error al restablecer la contraseña' };
  }
};
