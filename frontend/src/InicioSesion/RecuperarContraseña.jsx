import React, { useState } from 'react';
import fondo from './imagenfondo.jpeg'; // ✅ Importamos la imagen
import './RecuperarContraseña.css';

const RecuperarContrasenaCard = () => {
  const [formData, setFormData] = useState({
    nuevaContrasena: '',
    confirmarContrasena: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log('Contraseña actualizada:', formData);
      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({
          nuevaContrasena: '',
          confirmarContrasena: ''
        });
        setIsSubmitted(false);
      }, 3000);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div 
      className="recuperar-contrasena-container"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="recuperar-contrasena-card">
        <h2 className="recuperar-contrasena-title">Recuperar Contraseña</h2>
        
        {isSubmitted ? (
          <div className="mensaje-exitoso">
            <div className="circulo-exito">✅</div>
            <h3>¡Contraseña actualizada exitosamente!</h3>
            <p>Tu contraseña ha sido cambiada correctamente.</p>
          </div>
        ) : (
          <form className="recuperar-contrasena-form" onSubmit={handleSubmit}>
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
