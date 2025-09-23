import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout"; // ✔️ Importa como componente

import "../assets/styles.css"; // ✔️ Este sí es CSS, se importa como estilo

export default function Index() {
  return (
    <MainLayout>
      <div className="container">
        
        <h1>Bienvenido a Aurys</h1>
        <div className="btns">
          <Link to="/login" className="btn">Iniciar Sesión</Link>
          <Link to="/register" className="btn">Registrarse</Link>
        </div>
      </div>
    </MainLayout>
  );
}