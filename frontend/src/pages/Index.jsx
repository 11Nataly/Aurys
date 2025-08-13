import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles.css"; // Ajusta la ruta según tu proyecto

export default function Index() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">Aurys</div>
      </nav>

      <div className="container">
        <h1>Bienvenido a Aurys</h1>
        <div className="btns">
          <Link to="/login" className="btn">Iniciar Sesión</Link>
          <Link to="/register" className="btn">Registrarse</Link>
        </div>
      </div>
    </div>
  );
}
