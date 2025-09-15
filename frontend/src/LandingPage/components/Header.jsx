// src/components/Header/Header.jsx
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>Aurys</h2>
        </div>
        
        <nav className="navigation">
          <a href="#beneficios">Beneficios</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="auth-buttons">
          <button className="btn-login">Iniciar Sesión</button>
          <button className="btn-signup">Crear Cuenta</button>
        </div>
      </div>
    </header>
  );
};

export default Header;