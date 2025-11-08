import React, { useState } from "react";
import { login, register } from "../services/authService";

export default function LoginRegister() {
  const [loginUsuario, setLoginUsuario] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regUsuario, setRegUsuario] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [cargando, setCargando] = useState(false);

  const mostrarMensaje = (texto, tipo = "info", duracion = 3000) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    if (duracion > 0) setTimeout(() => setMensaje(""), duracion);
  };

  // 🔹 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsuario.trim() || !loginPassword.trim()) {
      mostrarMensaje("⚠️ Completa todos los campos", "error");
      return;
    }

    setCargando(true);
    try {
      // 👇 Llamada al servicio de login (usa /auth/login)
      const data = await login(loginUsuario.trim(), loginPassword.trim());

      // ✅ Guardar datos en localStorage
      if (data?.access_token && data?.id) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            id: data.id,
            rol: data.nombre_rol,
          })
        );

        mostrarMensaje("✅ Inicio de sesión exitoso", "success");

        // 🔁 Redirigir a la papelera (o página principal)
        setTimeout(() => (window.location.href = "/papelera"), 1000);
      } else {
        mostrarMensaje("❌ Credenciales incorrectas", "error");
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("🚨 Error al conectar con el servidor", "error");
    } finally {
      setCargando(false);
    }
  };

  // 🔹 REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regUsuario.trim() || !regPassword.trim() || !regEmail.trim()) {
      mostrarMensaje("⚠️ Completa todos los campos", "error");
      return;
    }

    setCargando(true);
    try {
      const data = await register({
        nombre: regUsuario.trim(),
        contrasena: regPassword.trim(),
        correo: regEmail.trim(),
      });

      mostrarMensaje(`✅ Usuario ${data.nombre} registrado con éxito`, "success");
      setRegUsuario("");
      setRegPassword("");
      setRegEmail("");
    } catch (error) {
      console.error(error);
      mostrarMensaje("🚨 Error al registrar usuario", "error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="form-box">
        <input
          type="email"
          placeholder="Correo"
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
          {cargando ? "Cargando..." : "Entrar"}
        </button>
      </form>

      <h2>📝 Registrarse</h2>
      <form onSubmit={handleRegister} className="form-box">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={regUsuario}
          onChange={(e) => setRegUsuario(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
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
          {cargando ? "Cargando..." : "Registrar"}
        </button>
      </form>

      {mensaje && <p className={`mensaje ${tipoMensaje}`}>{mensaje}</p>}
    </div>
  );
}
