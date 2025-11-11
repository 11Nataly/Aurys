import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBars } from "react-icons/fa";
import { listarPerfiles } from "../../../services/perfilService";
import { jwtDecode } from "jwt-decode";
import logoaurys from "./logoaurys.png";
import "./header.css";
import { logout } from "../../../services/authService"; // 🔑 Importamos logout

// Agregar prop mostrarHamburger con valor por defecto true
const Header = ({ onToggleSidebar, isSidebarOpen, mostrarHamburger = true }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = Number(decoded.sub || decoded.id || decoded.user_id);

        const perfiles = await listarPerfiles();
        const user = perfiles.find((p) => Number(p.id) === userId);

        if (user) setUserData(user);
      } catch (error) {
        console.error("Error cargando usuario:", error);
      }
    };

    fetchUser();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔒 Función de cierre de sesión
  const handleLogout = () => {
    setIsProfileOpen(false);
    logout(); // Limpia token, rol y redirige al Landing Page
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburguesa condicional */}
        {mostrarHamburger && (
          <button
            className={`hamburger-btn ${isSidebarOpen ? "active" : ""}`}
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            <FaBars className="hamburger-icon" />
          </button>
        )}

        <div className="logo">
          <img src={logoaurys} alt="Aurys Logo" className="logo-img" />
        </div>
      </div>

      <div className="header-right">
        <div className="profile-menu" ref={profileRef}>
          <button
            className={`profile-button ${isProfileOpen ? "active" : ""}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Menú de perfil"
          >
            {userData?.foto_perfil ? (
              <img
                src={userData.foto_perfil}
                alt="Foto de perfil"
                className="profile-image-header"
              />
            ) : (
              <FaUser className="profile-icon" />
            )}
          </button>

          {/* Menú desplegable */}
          <div className={`profile-dropdown ${isProfileOpen ? "show" : ""}`}>
            <div className="profile-dropdown-info">
              {userData?.foto_perfil ? (
                <img
                  src={userData.foto_perfil}
                  alt="Foto de perfil"
                  className="profile-image-dropdown"
                />
              ) : (
                <div className="profile-placeholder">
                  <FaUser />
                </div>
              )}

              <div className="profile-info-text">
                <span className="profile-name">
                  {userData?.nombre || "Usuario"}
                </span>
                <span className="profile-email">
                  {userData?.correo || "usuario@ejemplo.com"}
                </span>
              </div>
            </div>

            <Link
              to="/joven/perfil"
              className="dropdown-link"
              onClick={() => setIsProfileOpen(false)}
            >
              Mi Perfil
            </Link>

            {/* 🔴 Cerrar sesión seguro */}
            <button
              onClick={handleLogout}
              className="dropdown-link logout-btn"
              style={{
                background: "none",
                border: "none",
                color: "#dc3545",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                padding: "8px 16px",
                fontSize: "14px",
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
