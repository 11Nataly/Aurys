import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, X } from "lucide-react";
import { register } from "../services/authService"; 
import "../styles/register.css";
import Footer from "../LandingPage/components/Footer";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register({ nombre, correo, contrasena });

      // Mostrar modal de éxito
      setShowSuccessModal(true);
      
      // Limpiar el formulario
      setNombre("");
      setCorreo("");
      setContrasena("");

    } catch (err) {
      setError(err.message || "Error al registrarse. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    // Redirigir después de cerrar el modal
    const userRole = localStorage.getItem("rol") || "usuario";
    if (userRole === "administrador") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/joven/home";
    }
  };

  const handleModalBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Crear cuenta</h2>
          <p className="register-subtitle">Regístrate para comenzar</p>

          <form className="register-form" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={loading}
              />
              <User className="input-icon" />
            </div>

            {/* Correo */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                disabled={loading}
              />
              <Mail className="input-icon" />
            </div>

            {/* Contraseña con ojo */}
            <div className="input-group">
              <input
                type={mostrarContrasena ? "text" : "password"}
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                disabled={loading}
              />
              <Lock className="input-icon" />
              <button
                type="button"
                className="eye-btn"
                onClick={toggleMostrarContrasena}
                aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={loading}
              >
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            {/* Botón */}
            <button 
              type="submit" 
              className="register-button custom-button" 
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div className="register-footer">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="login-link">
              Inicia sesión
            </a>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleModalBackgroundClick}>
          <div className="success-modal">
            <button className="modal-close-btn" onClick={closeModal}>
              <X size={20} />
            </button>
            <div className="modal-content">
              <CheckCircle className="modal-icon" size={48} />
              <h3 className="modal-title">¡Registro Exitoso!</h3>
              <p className="modal-message">
                Te has registrado exitosamente. Se ha enviado un correo electrónico 
                para activar tu cuenta.
              </p>
              <button className="modal-confirm-btn" onClick={closeModal}>
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}