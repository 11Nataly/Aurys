// src/components/Footer.jsx
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <strong>Aurys</strong>
        <p>Tu compañero en salud mental.</p>
      </div>
      <div>
        <strong>Legal</strong>
        <ul>
          <li>Términos y condiciones</li>
          <li>Política de condiciones</li>
          <li>Cookies</li>
        </ul>
      </div>
      <p className="copyright">
        ©2025 Aurys. Todos los derechos reservados
      </p>
    </footer>
  );
};

export default Footer;