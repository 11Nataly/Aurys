import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

const Navbar = () => {
  return (
    <div>
      <nav>
        <Link className="nav-link" to="/">Inicio</Link> |{" "}
        <Link className="nav-link" to="/login">Login</Link> |{" "}
        <Link className="nav-link" to="/register">Registro</Link> |{" "}
        <Link className="nav-link" to="/admin">Admin</Link> |{" "}
        <Link className="nav-link" to="/perfil">Perfil</Link>
      </nav>
    </div>
  );
};

export default Navbar;
