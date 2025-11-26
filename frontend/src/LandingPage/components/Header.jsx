// src/LandingPage/components/Header.jsx
import './Header.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();


  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLoginClick = () => {
    setMenuActive(false);
    navigate("/login");
  };

  const handleRegisterClick = () => {
    setMenuActive(false);
    navigate("/register");
  };

  const handleBenefitsClick = () => {
    setMenuActive(false);
    const benefitsSection = document.getElementById('beneficios');
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>Aurys</h2>
        </div>

        <nav className={`navigation ${menuActive ? 'active' : ''}`}>
          <a href="#beneficios" onClick={handleBenefitsClick}>
            Beneficios
          </a>

          <div className="auth-buttons">
            <button className="btn-login" onClick={handleLoginClick}>
              Iniciar Sesión
            </button>
            <button className="btn-signup" onClick={handleRegisterClick}>
              Crear Cuenta
            </button>
          </div>
        </nav>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
