import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { login } from "../services/authService";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(correo, contrasena);

      // Guardar datos en localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("id_usuario", data.id);
      localStorage.setItem("rol", data.nombre_rol);

      // Redirección según el rol
      if (data.nombre_rol === "usuario") {
        navigate("/joven");
      } else if (data.nombre_rol === "administrador") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      // Si el backend devuelve un mensaje específico, úsalo
      if (err?.response?.data?.detail) {
        const detail = err.response.data.detail;

        // Detectar el tipo de error y mostrar mensaje más claro
        if (detail.includes("Credenciales incorrectas")) {
          setError("Correo o contraseña incorrectos. Intenta nuevamente.");
        } else if (detail.includes("bloqueada") || detail.includes("Has superado")) {
          setError("Tu cuenta ha sido bloqueada temporalmente por intentos fallidos. Intenta más tarde.");
        } else if (detail.includes("inactivo") || detail.includes("confirmar tu cuenta")) {
          setError("Tu cuenta no está activa. Revisa tu correo y confirma tu cuenta antes de iniciar sesión.");
        } else if (detail.includes("Token de confirmación")) {
          setError("Hubo un problema con tu confirmación de cuenta. Solicita un nuevo enlace.");
        } else {
          setError(detail);
        }
      } else {
        // Si no hay detalle, mensaje genérico
        setError("Ocurrió un error al iniciar sesión. Intenta nuevamente más tarde.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Inicia sesión</h2>
        <p className="login-subtitle">Accede a tu cuenta para continuar</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Correo */}
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

          {/* Contraseña */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <Lock className="input-icon" />
          </div>

          {/* Error */}
          {error && <p className="error-text">{error}</p>}

          {/* Recuperar contraseña */}
          <div className="forgot-password">
            <a href="/login/recuperar">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón */}
          <button type="submit" className="login-btn">
            Iniciar sesión
          </button>
        </form>

        {/* Texto de registro */}
        <p className="register-text">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
