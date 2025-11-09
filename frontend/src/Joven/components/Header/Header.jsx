// src/Joven/components/Header/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBars } from 'react-icons/fa';
import { userProfileData } from '../../fake_data/perfilData'; // ← RUTA CORRECTA
import logoaurys from './logoaurys.png';
import './header.css';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const userData = userProfileData;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
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
      </div>
      
      <div className="header-right">
        <div className="profile-menu" ref={profileRef}>
          <button 
            className={`profile-button ${isProfileOpen ? 'active' : ''}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Menú de perfil"
          >
            {userData?.fotoPerfil ? (
              <img 
                src={userData.fotoPerfil} 
                alt="Foto de perfil" 
                className="profile-image-header"
              />
            ) : (
              <FaUser className="profile-icon" />
            )}
          </button>
          
          <div className={`profile-dropdown ${isProfileOpen ? 'show' : ''}`}>
            <div className="profile-dropdown-info">
              {userData?.fotoPerfil ? (
                <img 
                  src={userData.fotoPerfil} 
                  alt="Foto de perfil" 
                  className="profile-image-dropdown"
                />
              ) : (
                <div className="profile-placeholder">
                  <FaUser />
                </div>
              )}
              <div className="profile-info-text">
                <span className="profile-name">{userData?.nombre || "Usuario"}</span>
                <span className="profile-email">{userData?.correo || "usuario@ejemplo.com"}</span>
              </div>
            </div>
            <Link 
              to="/joven/perfil" 
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

export default Header;