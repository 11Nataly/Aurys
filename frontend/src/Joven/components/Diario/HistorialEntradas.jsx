// src/components/Diario/HistorialEntradas.jsx
import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './HistorialEntradas.css';
import BuscarEntrada from './BuscarEntrada';

const HistorialEntradas = ({ entradas, onEditar, onEliminar, onVolver }) => {
  const [entradasExpandidas, setEntradasExpandidas] = useState({});
  const [entradasFiltradas, setEntradasFiltradas] = useState(entradas);

  // Actualiza entradas filtradas cuando cambien las originales
  useEffect(() => {
    setEntradasFiltradas(entradas);
  }, [entradas]);

  const toggleExpandirEntrada = (id) => {
    setEntradasExpandidas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="historial-entradas">
      <div className="historial-header">
        <button className="btn-volver" onClick={onVolver}>
          ← Volver al Diario
        </button>
        <h2>Historial de Entradas</h2>
        <BuscarEntrada entradas={entradas} onResultados={setEntradasFiltradas} />
        <div className="contador-entradas">
          {entradasFiltradas.length} {entradasFiltradas.length === 1 ? 'entrada' : 'entradas'}
        </div>
      </div>

      {entradasFiltradas.length === 0 ? (
        <div className="sin-entradas-container">
          <p className="sin-entradas">No hay entradas que coincidan con la búsqueda</p>
          <button className="btn-primera-entrada" onClick={() => onVolver()}>
            Crear mi primera entrada
          </button>
        </div>
      ) : (
        <div className="lista-entradas-compacta">
          {entradasFiltradas.map(entrada => (
            <div key={entrada.id} className="entrada-compacta">
              <div className="entrada-cabecera">
                <div className="entrada-info">
                  <h3 className="entrada-titulo">{entrada.titulo}</h3>
                  <span className="entrada-fecha">{entrada.fecha}</span>
                </div>
                <div className="entrada-acciones">
                  <button 
                    className="btn-editar" 
                    onClick={() => onEditar(entrada)} 
                    title="Editar entrada"
                  >
                    <span className="icono-editar">✏️</span>
                  </button>
                  <button 
                    className="btn-eliminar" 
                    onClick={() => onEliminar(entrada.id)} 
                    title="Eliminar entrada"
                  >
                    <span className="icono-eliminar">🗑️</span>
                  </button>
                </div>
              </div>

              <div className="entrada-contenido">
                <p className={`entrada-preview ${entradasExpandidas[entrada.id] ? 'expandido' : ''}`}>
                  {entrada.contenido.length > 150 && !entradasExpandidas[entrada.id]
                    ? `${entrada.contenido.substring(0, 150)}...`
                    : entrada.contenido}
                </p>
                {entrada.contenido.length > 150 && (
                  <button 
                    className="btn-expandir"
                    onClick={() => toggleExpandirEntrada(entrada.id)}
                  >
                    {entradasExpandidas[entrada.id] ? 'Ver menos' : 'Ver más'}
                  </button>
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