import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../services/authService";
import "../styles/login.css";
import Footer from "../LandingPage/components/Footer";

export default function InicioSesion() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(correo, contrasena);
      // Redirección se maneja dentro de authService
    } catch (err) {
      setError("Credenciales incorrectas o error en el servidor");
    }
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Inicia sesión</h2>
          <p className="login-subtitle">Accede a tu cuenta para continuar</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Campo correo */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <Mail className="input-icon" />
            </div>

            {/* Campo contraseña con ojo */}
            <div className="input-group">
              <input
                type={mostrarContrasena ? "text" : "password"}
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-icon eye-btn"
                onClick={toggleMostrarContrasena}
                aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarContrasena ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn">
              Iniciar sesión
            </button>
          </form>

          <p className="register-text">
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
