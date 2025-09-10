// src/components/EmergencyKit/EmergencyKit.jsx
import React from 'react';
import './EmergencyKit.css';

const EmergencyKit = ({ minimal = false }) => {
  return (
    <div className="emergency-kit">
      {!minimal && (
        <div className="emergency-header">
          <h1 className="titulo">Kit de emergencia</h1>
          <div className="emergency-buttons">
            <button className="custom-button">⭐ Mis motivaciones</button>
            <button className="custom-button">📊 Afrontamiento</button>
          </div>
        </div>
      )}

      <table className="emergency-table-kit">
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