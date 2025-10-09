import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { register } from "../services/authService"; 
import '../styles/register.css'

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await register({ nombre, correo, contrasena });

      if (data.access_token) {
        localStorage.setItem("nombre", data.nombre);
        localStorage.setItem("correo", data.correo);
        localStorage.setItem("contrasena", data.contrasena);
        navigate("/login");
      }
    } catch (err) {
      setError("Error al registrarse. Intenta de nuevo.");
    }
  };

  return (
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

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="register-button">
            Registrarse
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
  );
}