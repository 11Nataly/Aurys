import JovenLayout from "./Joven/JovenLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./InicioSesion/InicioSesion";
import Register from "./Registro/Registro";
import Home from "./Joven/pages/Home";
import PrivateRoute from "./InicioSesion/Privaterouter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing pública */}
        <Route path="/home" element={<Home />} />
        <Route index element={<Navigate to="/home" replace />} />
        {/* Login */}
        <Route path="/login" element={<Login />} />
        {/* Rutas protegidas / app del paciente */}
        <Route path="/register" element={<Register />} />
        {/* PacienteLayout ya NO debe incluir BrowserRouter */}
        
        <Route path="/usuario/*" element={<PrivateRoute rol="usuario"> <JovenLayout /> </PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}