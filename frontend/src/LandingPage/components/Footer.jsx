//src/components/Footer/Footer.jsx
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Aurys</h3>
            <p>Tu compañero en salud mental, diseñado para apoyarte en el manejo de la depresión y ansiedad</p>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Términos y condiciones</a></li>
              <li><a href="#">Política de privacidad</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Aurys. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;