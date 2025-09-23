import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { register } from "../services/authService"; 

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
      // Llamamos al endpoint de registro
      const data = await register({ nombre, correo, contrasena });

      // Si el backend devuelve un token
      if (data.access_token) {
        localStorage.setItem("nombre", data.nombre);
        localStorage.setItem("correo", data.correo);
        localStorage.setItem("contrasena", data.contrasena);

        // Si solo devuelve un "Usuario creado"
        navigate("/login");
      }
    } catch (err) {
      setError("Error al registrarse. Intenta de nuevo.");
    }
  };

  return (
    <div className="md:w-1/2 bg-green-500 flex items-center justify-center p-4 pl-16">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm md:-translate-x-6 my-6 py-15">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          Crear cuenta
        </h2>
        <p className="text-center text-gray-600 mb-4 text-sm">
          Regístrate para comenzar
        </p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="flex-1 outline-none text-sm"
              required
            />
            <User className="text-gray-400 w-5 h-5 ml-2" />
          </div>

          {/* Correo */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="flex-1 outline-none text-sm"
              required
            />
            <Mail className="text-gray-400 w-5 h-5 ml-2" />
          </div>

          {/* Contraseña */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="flex-1 outline-none text-sm"
              required
            />
            <Lock className="text-gray-400 w-5 h-5 ml-2" />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition font-medium text-sm"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
