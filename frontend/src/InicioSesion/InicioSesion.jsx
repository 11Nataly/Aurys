import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { login } from "../services/authService"; 

export default function Login() {

  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
    const data = await login(correo, contrasena); // { access_token, token_type, rol }
    
    // Guardar token y rol
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("rol_id", data.rol);
    localStorage.setItem("id_usuario", data.nombre_rol);

    // Redirigir según el rol
    if (data.nombre_rol === "usuario") {
      navigate("/usuario/inicio"); 
    } else if (data.nombre_rol === "Administrador") {
      navigate("/admin/panel");
    } else {
      navigate("/"); // fallback
    }
  } catch (err) {
    setError("Credenciales incorrectas o error de servidor");
  }
};

  return (
    <div className="md:w-1/2 bg-green-500 flex items-center justify-center p-4 pl-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm md:-translate-x-6 my-6 py-15">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
              Inicia sesión
            </h2>
            <p className="text-center text-gray-600 mb-4 text-sm">
              Accede a tu cuenta para continuar
            </p>

            <form className="space-y-3" onSubmit={handleSubmit}>
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

              {error && (
                <p className="text-red-500 text-xs text-center">{error}</p>
              )}

              <div className="text-right">
                <a
                  href="/login/recuperar"
                  className="text-xs text-blue-500 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition font-medium text-sm"
              >
                Iniciar sesión
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-4">
              ¿No tienes cuenta?{" "}
              <a
                href="/register"
                className="text-blue-500 font-medium hover:underline"
              >
                Regístrate
              </a>
            </p>
          </div>
        </div>
  );
}