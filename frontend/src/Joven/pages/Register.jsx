import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/register.css';


const backendURL = "http://localhost:8000";

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolId, setRolId] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!nombre || !email || !password) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch(`${backendURL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          correo: email,
          contrasena: password,
          rol_id: rolId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuario registrado con éxito. Serás redirigido al login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.detail || 'Error al registrar el usuario.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="register-container">
      <nav className="navbar">
        <div className="navbar-logo">Aurys</div>
      </nav>

      <div className="register-card">
        <form className="register-form" onSubmit={handleRegister}>
          <h2 className="register-title">Crea cuenta</h2>
          <p className="register-subtitle">Ingresa tus datos para registrarte</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="Usuario"
              name="nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Correo"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              name="contrasena"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Rol oculto */}
          <input type="hidden" value={rolId} onChange={(e) => setRolId(e.target.value)} />

          <button type="submit" className="register-button">
            Crear cuenta
          </button>

          {message && <p className="error-message">{message}</p>}

          <div className="register-footer">
            <Link to="/login" className="login-link">
              ¿Ya tienes una cuenta?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
