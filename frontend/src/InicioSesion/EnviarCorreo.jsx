import React, { useState } from "react";
import "./EnviarCorreo.css";
import { recuperarContrasena } from "../services/recuperarContrasenaService";

const EnviarCorreoCard = () => {
  const [formData, setFormData] = useState({
    enviarCorreo: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.enviarCorreo) {
      newErrors.enviarCorreo = "El correo es requerido";
    } else if (!formData.enviarCorreo.includes("@")) {
      newErrors.enviarCorreo = "El correo debe contener @";
    } else if (!formData.enviarCorreo.includes(".")) {
      newErrors.enviarCorreo = "El correo debe tener un dominio (.)";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    const formErrors = validateForm(); // Valida los campos del formulario
    if (Object.keys(formErrors).length === 0) {
      try {
        setLoading(true); // Activa el estado de carga mientras se procesa la petición

        await recuperarContrasena(formData.enviarCorreo); // 🔗 Llamada al backend (POST /recuperar-contrasena)
        // Envía { correo: formData.enviarCorreo } al backend
        // A través del servicio recuperarContrasena()

        setIsSubmitted(true); // Cambia el estado para mostrar mensaje de éxito
      } catch (error) {
        alert(error.message || "No se pudo enviar el correo."); // Muestra error si la API falla
      } finally {
        setLoading(false); // Desactiva el estado de carga al finalizar la petición
      }
    } else {
      setErrors(formErrors); // Si hay errores de validación, los muestra en el formulario
    }
  };

  return (
    <div className="recuperar-contrasena-container">
      <div className="recuperar-contrasena-card">
        <h2 className="recuperar-contrasena-title">Recuperar contraseña</h2>

        {isSubmitted ? (
          <div className="mensaje-exitoso">
            <div className="circulo-exito">✅</div>
            <h3>¡Correo enviado exitosamente!</h3>
            <p>Tu correo ha sido enviado correctamente. Revisa tu bandeja.</p>
          </div>
        ) : (
          <form className="recuperar-contrasena-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="enviarCorreo"
                name="enviarCorreo"
                value={formData.enviarCorreo}
                onChange={handleChange}
                className={errors.enviarCorreo ? "error" : ""}
                placeholder="Ingresa tu correo"
                disabled={loading}
              />
              {errors.enviarCorreo && (
                <div className="error-message">{errors.enviarCorreo}</div>
              )}
            </div>

            <button type="submit" className="btn-actualizar" disabled={loading}>
              {loading ? "Enviando..." : "Enviar correo"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnviarCorreoCard;
