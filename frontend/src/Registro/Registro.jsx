import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Eye, EyeOff } from "lucide-react";
import { register } from "../services/authService"; 
import "../styles/register.css";
import "./RegistroExitoso.css";
import Footer from "../LandingPage/components/Footer";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const data = await register({ nombre, correo, contrasena });

      // Mostrar mensaje de éxito
      setSuccess(true);
      
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

  // Si el registro fue exitoso, mostramos el componente de éxito
  if (success) {
    return (
      <div className="registro-exitoso-container">
        <div className="registro-exitoso-card">
          <div className="registro-exitoso-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="registro-exitoso-title">¡Usuario registrado exitosamente!</h2>
          <p className="registro-exitoso-message">
            Ahora puedes ingresar a Aurys y utilizar todas sus funcionalidades.
          </p>
          <Link to="/login" className="registro-exitoso-button">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  // Si no hay éxito, mostramos el formulario normal
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

            {/* Contraseña con ojo - SIN ÍCONO DE CANDADO */}
            <div className="input-group">
              <input
                type={mostrarContrasena ? "text" : "password"}
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                disabled={loading}
              />
              {/* EL ÍCONO Lock HA SIDO ELIMINADO */}
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

      <Footer />
    </div>
  );
}