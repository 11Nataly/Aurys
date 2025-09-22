import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import '../styles/header.css';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img src="/logoaurys.png" alt="Aurys Logo" className="logo-img" />
          <span className="logo-text">Aurys</span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="profile-menu">
          <button 
            className="profile-button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <FaUser className="profile-icon" />
          </button>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              <a href="/perfil">Mi Perfil</a>
              <a href="/logout">Cerrar Sesión</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;