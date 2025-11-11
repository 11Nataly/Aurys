// src/Joven/pages/Home.jsx
import React from "react";
import "../components/Home/home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const irAlDiario = () => {
    navigate("/joven/diario"); // 👈 ruta de tu página Diario
  };
  
  const IralTecnica = () => {
    navigate("/joven/afrontamiento"); // 👈 ruta de tu página Diario
  };
  return (
    <div className="home-container">
      {/* Carta de bienvenida */}
      <div className="welcome-card">
        <div className="welcome-icon">✨</div>
        <div className="welcome-text">
          <h2>Bienvenido a Aurys</h2>
          <p>Tu espacio seguro para gestionar tu bienestar emocional.</p>
        </div>
      </div>

      {/* Contenedor de tarjetas */}
      <div className="cards-container">
        <div className="cards">
          {/* Tarjeta Diario */}
          <div className="card">
            <div className="card-icon">📔</div>
            <h3>Diario Emocional</h3>
            <p>
              Registra tus pensamientos y emociones para llevar un seguimiento
              de tu bienestar mental.
            </p>
            <button onClick={irAlDiario}>Ir al Diario</button>
          </div>

          {/* Tarjeta Afrontamiento */}
          <div className="card">
            <div className="card-icon">🛡️</div>
            <h3>Técnicas de Afrontamiento</h3>
            <p>
              Descubre estrategias efectivas para manejar el estrés y la
              ansiedad en tu día a día.
            </p>
            <button onClick={IralTecnica}>Ir al Tecnica</button>
          </div>
        </div>
      </div>

      {/* Sección de emergencia con tabla */}
      <div className="emergency-section">
        <div className="emergency-header">
          <div className="emergency-icon">🆘</div>
          <h2 className="emergency-title">Líneas de Emergencia</h2>
        </div>

        <table className="emergency-table-kit minimal-version">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Teléfono</th>
              <th>Disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Línea de Crisis</td>
              <td>106</td>
              <td>24/7</td>
            </tr>
            <tr>
              <td>Salud Mental</td>
              <td>018000111022</td>
              <td>24/7</td>
            </tr>
            <tr>
              <td>Atención Psicológica</td>
              <td>018000112439</td>
              <td>Lunes a Viernes 8am-5pm</td>
            </tr>
            <tr>
              <td>Emergencias Médicas</td>
              <td>123</td>
              <td>24/7</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
