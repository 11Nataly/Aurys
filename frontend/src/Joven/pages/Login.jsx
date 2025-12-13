import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/LoginRegister.css"; // Asegúrate de que la ruta sea correcta

const backendURL = "https://aurys-production.up.railway.app";

export default function Login() {
  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Estado para el mensaje de respuesta
  const [message, setMessage] = useState('');
  // Hook para la redirección
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    // Verificación básica
    if (!email || !password) {
      setMessage('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      // Petición al backend para iniciar sesión
      const response = await fetch(`${backendURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Inicio de sesión exitoso.');
        
        // Guardar el token de acceso en el almacenamiento local
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }

        // Redirigir según el rol del usuario
        // `rol_id` 1 es para la página principal, `rol_id` 2 es para la página de administración
        if (data.rol_id === 1) {
          navigate('/');
        } else if (data.rol_id === 2) {
          navigate('/admin');
        } else {
          // Para cualquier otro rol, redirigir a la página principal por defecto
          navigate('/');
        }
      } else {
        // Manejo de errores
        setMessage(data.detail || 'Error en el inicio de sesión.');
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
          <form className="login-form" onSubmit={handleLogin}>
            <h2 id="titulo">Iniciar Sesión</h2>

            <div className="form-group">
              <label>
                <b>Ingrese su correo electrónico</b>
              </label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group password-group">
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

            <div className="btns">
              <p className="btn2">
                <Link to="/register">Crear cuenta</Link>
              </p>
              <button type="submit" className="btn">
                <b>Iniciar Sesión</b>
              </button>
            </div>
            
            {/* Mensaje de respuesta del servidor */}
            {message && <p className="message">{message}</p>}

            <p className="forgot-password">
              <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
