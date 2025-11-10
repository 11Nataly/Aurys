import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restablecerContrasena } from '../services/recuperarContrasenaService';
import './RecuperarContraseña.css';

const RecuperarContrasenaCard = () => {
  const { token } = useParams(); // 🔹 Captura el token desde la URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nuevaContrasena: '',
    confirmarContrasena: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nuevaContrasena) {
      newErrors.nuevaContrasena = 'La nueva contraseña es requerida';
    } else if (formData.nuevaContrasena.length < 8) {
      newErrors.nuevaContrasena = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Debe confirmar la contraseña';
    } else if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');

    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await restablecerContrasena(token, formData.nuevaContrasena);
        console.log('Contraseña actualizada:', response);
        setIsSubmitted(true);

        // 🔹 Redirige al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        setMensajeError(error.detail || error.message || 'Ocurrió un error inesperado');
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="recuperar-contrasena-container">
      <div className="recuperar-contrasena-card">
        <h2 className="recuperar-contrasena-title">Recuperar Contraseña</h2>

        {isSubmitted ? (
          <div className="mensaje-exitoso">
            <div className="circulo-exito">✅</div>
            <h3>¡Contraseña actualizada exitosamente!</h3>
            <p>Serás redirigido al inicio de sesión en unos segundos.</p>
          </div>
        ) : (
          <form className="recuperar-contrasena-form" onSubmit={handleSubmit}>
            {mensajeError && <div className="error-global">{mensajeError}</div>}

            <div className="form-group">
              <label htmlFor="nuevaContrasena" className="required-field">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="nuevaContrasena"
                name="nuevaContrasena"
                value={formData.nuevaContrasena}
                onChange={handleChange}
                className={errors.nuevaContrasena ? 'error' : ''}
                placeholder="Ingresa tu nueva contraseña"
              />
              {errors.nuevaContrasena && (
                <div className="error-message">{errors.nuevaContrasena}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena" className="required-field">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className={errors.confirmarContrasena ? 'error' : ''}
                placeholder="Confirma tu nueva contraseña"
              />
              {errors.confirmarContrasena && (
                <div className="error-message">{errors.confirmarContrasena}</div>
              )}
            </div>

            <button type="submit" className="btn-actualizar">
              Actualizar Contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecuperarContrasenaCard;
