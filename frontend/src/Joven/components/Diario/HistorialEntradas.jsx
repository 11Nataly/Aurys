// src/components/Diario/HistorialEntradas.jsx
import { useState } from 'react';

const HistorialEntradas = ({ entradas, onEditar, onEliminar, onVolver }) => {
  const [entradasExpandidas, setEntradasExpandidas] = useState({});

  const toggleExpandirEntrada = (id) => {
    setEntradasExpandidas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="historial-entradas">
      <div className="historial-header">
        <h2>Historial de Entradas</h2>
        <button className="btn-volver" onClick={onVolver}>
          ← Volver
        </button>
      </div>
      
      {entradas.length === 0 ? (
        <p className="sin-entradas">No hay entradas previas</p>
      ) : (
        <div className="lista-entradas">
          {entradas.map(entrada => (
            <div key={entrada.id} className="entrada-historial">
              <div className="entrada-historial-header">
                <h3>{entrada.titulo}</h3>
                <span>{entrada.fecha}</span>
              </div>
              <div className="entrada-historial-acciones">
                <button onClick={() => onEditar(entrada)} title="Editar">
                  ✏️
                </button>
                <button onClick={() => onEliminar(entrada.id)} title="Eliminar">
                  🗑️
                </button>
              </div>
              <div className="entrada-historial-contenido">
                <p className="entrada-historial-preview">
                  {entrada.contenido.substring(0, 150)}
                  {entrada.contenido.length > 150 && !entradasExpandidas[entrada.id] && '...'}
                </p>
                {entrada.contenido.length > 150 && (
                  <>
                    <div className={`entrada-contenido-completo ${entradasExpandidas[entrada.id] ? 'mostrar' : ''}`}>
                      {entrada.contenido.substring(150)}
                    </div>
                    <button 
                      className={`btn-ver-mas ${entradasExpandidas[entrada.id] ? 'abierto' : ''}`}
                      onClick={() => toggleExpandirEntrada(entrada.id)}
                    >
                      {entradasExpandidas[entrada.id] ? 'Ver menos' : 'Ver más'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialEntradas;