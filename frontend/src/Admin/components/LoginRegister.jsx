import React, { useState } from 'react';

const backendURL = "https://aurys-production.up.railway.app"; // Cambia si quieres

export default function LoginRegister() {
  const [loginUsuario, setLoginUsuario] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regUsuario, setRegUsuario] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('info');
  const [cargando, setCargando] = useState(false);

  const mostrarMensaje = (texto, tipo = 'info', duracion = 3000) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    if (duracion > 0) {
      setTimeout(() => setMensaje(''), duracion);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsuario.trim() || !loginPassword.trim()) {
      mostrarMensaje('⚠️ Por favor completa todos los campos', 'error');
      return;
    }
    setCargando(true);
    try {
      const response = await fetch(`${backendURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: loginUsuario.trim(), contrasena: loginPassword.trim() }),
      });

      if (!response.ok) {
        mostrarMensaje('❌ Usuario o contraseña incorrectos', 'error');
        return;
      }
      const data = await response.json();

      // Guardar token si el backend lo envía
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      mostrarMensaje(`✅ Bienvenido, ${data.correo || loginUsuario}`, 'success');
    } catch (error) {
      mostrarMensaje('🚨 Error de conexión con el servidor', 'error');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regUsuario.trim() || !regPassword.trim() || !regEmail.trim()) {
      mostrarMensaje('⚠️ Por favor completa todos los campos', 'error');
      return;
    }
    setCargando(true);
    try {
      const response = await fetch(`${backendURL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: regUsuario.trim(), contrasena: regPassword.trim(), correo: regEmail.trim() }),
      });

      if (!response.ok) {
        mostrarMensaje('❌ Error al registrar usuario', 'error');
        return;
      }
      const data = await response.json();
      mostrarMensaje(`✅ Usuario ${data.nombre || regUsuario} registrado con éxito`, 'success');
      setRegUsuario('');
      setRegPassword('');
      setRegEmail('');
    } catch (error) {
      mostrarMensaje('🚨 Error de conexión con el servidor', 'error');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="form-box">
        <input
          type="text"
          placeholder="Usuario o correo"
          value={loginUsuario}
          onChange={(e) => setLoginUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Cargando...' : 'Entrar'}
        </button>
      </form>

      <h2>📝 Registrarse</h2>
      <form onSubmit={handleRegister} className="form-box">
        <input
          type="text"
          placeholder="Usuario"
          value={regUsuario}
          onChange={(e) => setRegUsuario(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Cargando...' : 'Registrar'}
        </button>
      </form>

      {mensaje && (
        <p className={`mensaje ${tipoMensaje}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
