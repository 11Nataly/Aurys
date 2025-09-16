import React from "react";
import { useNavigate } from "react-router-dom";
import EmergencyKit from "../components/KitEmergencia/EmergencyKit";
// Corregir la ruta de importación del CSS
import "../components/Home/home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleAfrontamientoClick = () => {
    navigate("/joven/afrontamiento");
  };

  const handleDiarioClick = () => {
    // Navegar a la página de diario
    navigate("/joven/diario");
  };

  return (
    <div className="home">
      {/* Tarjeta de bienvenida */}
      <div className="welcome-card">
        <div className="welcome-icon">👋</div>
        <div className="welcome-text">
          <h2>Bienvenido a tu espacio seguro</h2>
          <p>Aquí encontrarás herramientas para tu bienestar emocional, incluyendo tu diario personal, técnicas de afrontamiento y líneas de emergencia disponibles cuando las necesites.</p>
        </div>
      </div>

      {/* Tarjetas de Diario y Afrontamiento */}
      <div className="cards">
        <div className="card">
          <div className="card-icon">📔</div>
          <h3>Diario</h3>
          <p>
            Tu diario es ese amigo que siempre te escucha en silencio...
          </p>
          <button onClick={handleDiarioClick}>Escribir ahora</button>
        </div>
        <div className="card">
          <div className="card-icon">💪</div>
          <h3>Afrontamiento</h3>
          <p>
            Las técnicas de afrontamiento son como amigos sabios...
          </p>
          <button onClick={handleAfrontamientoClick}>Ir ahora</button>
        </div>
      </div>

      {/* Sección de Líneas de Emergencia - Importada desde EmergencyKit */}
      <div className="emergency-section">
        <h2 className="emergency-title">Líneas de emergencia</h2>
        <EmergencyKit minimal={true} />
      </div>
    </div>
  );
}