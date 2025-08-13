import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/styles.css";

// Se ha corregido la URL del backend para usar "localhost" en lugar de "127.0.0.1"
const backendURL = "http://localhost:8000";

export default function Register() {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolId, setRolId] = useState(1); // Valor por defecto
  // Estado para el mensaje de respuesta
  const [message, setMessage] = useState('');
  // Hook para la redirección
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    // Verificación básica
    if (!nombre || !email || !password) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Petición al backend para registrar un nuevo usuario
      const response = await fetch(`${backendURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setTimeout(() => navigate('/login'), 2000); // Redirige al login después de 2 segundos
      } else {
        setMessage(data.detail || 'Error al registrar el usuario.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión con el servidor.');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">Aurys</div>
      </nav>

      <div className="container">
        <div className="login-container">
          <form className="login-form" onSubmit={handleRegister}>
            <h2 id="titulo">Crear cuenta</h2>

            <div className="form-group">
              <label>
                <b>Ingrese su usuario</b>
              </label>
              <input
                type="text"
                name="nombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                <b>Ingrese su correo</b>
              </label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                <b>Ingrese su contraseña</b>
              </label>
              <input
                type="password"
                name="contrasena"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {/* Campo para el rol_id (puede ser oculto o con una selección) */}
            <input type="hidden" value={rolId} onChange={(e) => setRolId(e.target.value)} />

            <button type="submit" className="btn">
              <b>Crear cuenta</b>
            </button>
            
            {/* Mensaje de respuesta del servidor */}
            {message && <p className="message">{message}</p>}

            <div className="login-link">
              <Link to="/login" className="login-text">
                ¿Ya tienes una cuenta?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
