import './footer.css';

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundColor: '#4840c2' }}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Aurys</h3>
          <p>Tu compañero en salud mental, diseñado para apoyarte en el manejo de la depresión y ansiedad.</p>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="/terminos">Términos y condiciones</a></li>
            <li><a href="/privacidad">Política de privacidad</a></li>
            <li><a href="/cookies">Cookies</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aurys. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;