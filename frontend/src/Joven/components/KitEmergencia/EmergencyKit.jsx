import React from "react";
import { useNavigate } from "react-router-dom";
import "./kitemergencias.css";

const EmergencyKit = ({ minimal = false }) => {
  const navigate = useNavigate();

  const handleAfrontamientoClick = () => {
    navigate("/joven/afrontamiento");
  };

  const handleMisMotivacionesClick = () => {
    navigate("/joven/kit-emergencia/mis-motivaciones");
  };

  // Cuando minimal es true, mostramos la versión compacta
  if (minimal) {
    return (
      <table className="emergency-table-kit minimal-version">
        <thead>
          <tr>
            <th>Agencia</th>
            <th>Número telefónico</th>
            <th>Horario de atención</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Secretaría de salud</td>
            <td>106</td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Línea única de emergencias Nacional</td>
            <td>123</td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Línea "porque quiero estar bien"</td>
            <td>3330333588</td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Policía Nacional</td>
            <td>018000110488</td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Ministerio de la Protección Social</td>
            <td>018000113113</td>
            <td>24/7</td>
          </tr>
        </tbody>
      </table>
    );
  }

  // Versión completa (más grande) para la página propia
  return (
    <div className="emergency-kit full-version">
      <div className="emergency-header">
        <h1 className="titulo">Kit de emergencia</h1>
        <div className="emergency-buttons">
          <button className="custom-button" 
          onClick={handleMisMotivacionesClick}>
            ⭐ Mis motivaciones
          </button>
          <button
            className="custom-button"
            onClick={handleAfrontamientoClick}
          >
            📊 Afrontamiento
          </button>
        </div>
      </div>

      <table className="emergency-table-kit full-version">
        <thead>
          <tr>
            <th>Agencia</th>
            <th>Número telefónico</th>
            <th>Horario de atención</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Secretaría de salud</td>
            <td>106</td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Línea única de emergencias Nacional</td>
            <td>123</td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Línea "porque quiero estar bien"</td>
            <td>3330333588</td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Policía Nacional</td>
            <td>018000110488</td>
            <td>24/7</td>
          </tr>
          <tr>
            <td>Ministerio de la Protección Social</td>
            <td>018000113113</td>
            <td>24/7</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmergencyKit;