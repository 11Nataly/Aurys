// services/recuperarContrasenaService.js
import api from './api'; // 🔹 Importa la instancia de Axios configurada en api.js
                        // Esta instancia contiene la URL base del backend y las configuraciones necesarias
                        // para hacer las peticiones HTTP (como headers o tokens, si existen)

export const recuperarContrasena = async (correo) => { // 🔹 Exporta una función asíncrona (promesa)
                                                       // que se encarga de llamar al endpoint de recuperación de contraseña.
                                                       // Recibe como parámetro el correo del usuario.

  try {
    const response = await api.post('/recuperar-contrasena', { // 🔹 Realiza una petición HTTP POST al backend
                                                               // usando Axios a la ruta /recuperar-contrasena
      correo: correo // 🔹 Este es el cuerpo (body) del POST.
                     // Se envía un objeto JSON con la propiedad "correo"
                     // tal como el backend espera según el DTO (CorreoDTO)
    });

    return response.data; // 🔹 Devuelve solo la parte útil de la respuesta (el contenido del backend),
                          // normalmente algo como: { msg: "Te hemos enviado un correo para recuperar tu contraseña." }

  } catch (error) {
    console.error('Error al recuperar contraseña:', error); // 🔹 Muestra en consola el error completo (para depuración)
    
    // 🔹 Verifica si el backend envió una respuesta de error (error.response.data),
    // si no existe, devuelve un mensaje genérico para el frontend.
    throw error.response?.data || { message: 'Error al enviar el correo' };
  }
};
