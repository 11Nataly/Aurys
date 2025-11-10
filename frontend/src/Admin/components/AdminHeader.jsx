import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import { listarPerfiles } from "../../services/perfilService";
import { jwtDecode } from "jwt-decode";
import logoaurys from "../../Joven/components/Header/logoaurys.png";
import "../../Joven/components/Header/header.css";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const profileRef = useRef(null);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lógica para mostrar botón volver
  const shouldShowBackButton = () => {
    if (location.pathname === '/admin') return false;
    if (location.pathname === '/home') return false;
    if (location.pathname === '/login' || location.pathname === '/register') return false;
    return true;
  };

  // Función para volver atrás
  const handleGoBack = () => {
    if (location.pathname.startsWith('/admin/') && location.pathname !== '/admin') {
      navigate('/admin');
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Botón volver condicional */}
        {shouldShowBackButton() && (
          <button 
            className="back-button"
            onClick={handleGoBack}
            aria-label="Volver atrás"
          >
            <FaArrowLeft className="back-icon" />
            <span className="back-text">Volver</span>
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
                  {userData?.nombre || "Administrador"}
                </span>
                <span className="profile-email">
                  {userData?.correo || "admin@ejemplo.com"}
                </span>
              </div>
            </div>

            <Link
              to="/admin/perfil"
              className="dropdown-link"
              onClick={() => setIsProfileOpen(false)}
            >
              Mi Perfil
            </Link>

            <Link
              to="/logout"
              className="dropdown-link"
              onClick={() => setIsProfileOpen(false)}
            >
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;