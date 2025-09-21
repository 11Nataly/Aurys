// src/components/Header/Header.jsx
import './Header.css';
import { useState } from 'react';

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <h2>Aurys</h2>
        </div>

        {/* Navegación */}
        <nav className={`navigation ${menuActive ? 'active' : ''}`}>
          <a href="#beneficios">Beneficios</a>

          {/* Botones de autenticación (se adaptan en mobile/desktop) */}
          <div className="auth-buttons">
            <button className="btn-login">Iniciar Sesión</button>
            <button className="btn-signup">Crear Cuenta</button>
          </div>
        </nav>

        {/* Botón hamburguesa */}
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
