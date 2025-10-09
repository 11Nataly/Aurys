// src/Joven/components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaChevronRight } from 'react-icons/fa';
import logoaurys from './logoaurys.png';
import './header.css';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Cerrar menú de perfil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Cerrar sesión: limpiar localStorage y redirigir al login
  const handleCerrarSesion = () => {
    localStorage.clear(); // 🧹 borra todo
    setIsProfileOpen(false);
    navigate('/login'); // 🔁 redirige al login
  };

  // 🔹 Generar las migas de pan
  const getBreadcrumbItems = () => {
    const breadcrumbItems = [];
    breadcrumbItems.push({ name: 'Home', path: '/joven/home', isActive: false });

    if (location.pathname === '/joven/diario') {
      breadcrumbItems.push({ name: 'Diario', path: '/joven/diario', isActive: true });
    } else if (location.pathname === '/joven/kit-emergencia') {
      breadcrumbItems.push({ name: 'Kit de emergencia', path: '/joven/kit-emergencia', isActive: true });
    } else if (
      location.pathname.includes('/joven/kit-emergencia/afrontamiento') ||
      location.pathname === '/joven/afrontamiento'
    ) {
      breadcrumbItems.push({ name: 'Kit de emergencia', path: '/joven/kit-emergencia', isActive: false });
      breadcrumbItems.push({
        name: 'Afrontamiento',
        path: location.pathname.includes('/joven/kit-emergencia/afrontamiento')
          ? '/joven/kit-emergencia/afrontamiento'
          : '/joven/afrontamiento',
        isActive: true,
      });
    } else if (location.pathname === '/joven/promesas') {
      breadcrumbItems.push({ name: 'Promesas', path: '/joven/promesas', isActive: true });
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumbItems();
  const showBreadcrumb = breadcrumbItems.length > 1 && location.pathname !== '/joven/home';

  return (
    <header className="header">
      <div className="header-left">
        {/* Botón hamburger */}
        <button
          className={`hamburger-btn ${isSidebarOpen ? 'active' : ''}`}
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <FaBars className="hamburger-icon" />
        </button>

        <div className="logo">
          <img src={logoaurys} alt="Aurys Logo" className="logo-img" />
        </div>

        {/* Migas de pan */}
        {showBreadcrumb && (
          <nav className="breadcrumb" aria-label="Migas de pan">
            {breadcrumbItems.map((item, index) => (
              <span key={index} className="breadcrumb-item-container">
                {index > 0 && (
                  <span className="breadcrumb-separator">
                    <FaChevronRight />
                  </span>
                )}
                {item.isActive ? (
                  <span className="breadcrumb-item active">{item.name}</span>
                ) : (
                  <Link to={item.path} className="breadcrumb-item">
                    {item.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="header-right">
        <div className="profile-menu" ref={profileRef}>
          <button
            className={`profile-button ${isProfileOpen ? 'active' : ''}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Menú de perfil"
          >
            <FaUser className="profile-icon" />
          </button>

          <div className={`profile-dropdown ${isProfileOpen ? 'show' : ''}`}>
            <Link to="/perfil" onClick={() => setIsProfileOpen(false)}>
              Mi Perfil
            </Link>
            <button className="logout-btn" onClick={handleCerrarSesion}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
