import React, { useState } from 'react';
import './ModalRegistroFallos.css';

const ModalRegistroFallos = ({ promesa, onConfirmar, onCancelar }) => {
  const [confirmado, setConfirmado] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  // Verificar si la promesa está en período activo
  const estaEnPeriodoActivo = () => {
    if (promesa.estado !== 'activa') return false;
    
    const hoy = new Date().toISOString().split('T')[0];
    const fechaFinal = new Date(promesa.fechaFinalizacion);
    const fechaHoy = new Date(hoy);
    
    return fechaHoy <= fechaFinal;
  };

  const puedeRegistrarFallo = estaEnPeriodoActivo();

  const handleConfirmar = () => {
    if (puedeRegistrarFallo) {
      onConfirmar(cantidad);
    }
  };

  const obtenerMensajeEstado = () => {
    if (!estaEnPeriodoActivo()) {
      return "Esta promesa ha finalizado su período. No puedes registrar más fallos.";
    }
    
    if (promesa.frecuencia === 'diaria') {
      const fallosHoy = promesa.progreso.fallosHoy || 0;
      const restantes = promesa.fallosPermitidos - fallosHoy;
      
      if (restantes <= 0) {
        return "Has alcanzado el límite de fallos permitidos para hoy.";
      }
      return `Puedes registrar hasta ${restantes} fallo(s) más hoy.`;
    }
    
    return "¿Estás seguro de que quieres registrar este fallo?";
  };

  return (
    <div className="modal-registro-overlay">
      <div className="modal-registro">
        <h2>Registrar Fallo</h2>
        
        <div className="modal-content">
          <div className="promesa-info">
            <h3>{promesa.titulo}</h3>
            <p>Frecuencia: <strong>{promesa.frecuencia}</strong></p>
            <p>Fallos permitidos: <strong>{promesa.fallosPermitidos}</strong></p>
          </div>

          <div className={`estado-alerta ${!puedeRegistrarFallo ? 'inactiva' : ''}`}>
            <p>{obtenerMensajeEstado()}</p>
          </div>

          {puedeRegistrarFallo && (
            <div className="control-cantidad">
              <label htmlFor="cantidadFallos">Cantidad de fallos:</label>
              <input
                type="number"
                id="cantidadFallos"
                min="1"
                max={promesa.fallosPermitidos - (promesa.progreso.fallosHoy || 0)}
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                disabled={!puedeRegistrarFallo}
              />
            </div>
          )}

          <div className="detalle-registro">
            <p>
              <strong>Fecha:</strong> {new Date().toLocaleDateString()}
            </p>
            <p>
              <strong>Hora:</strong> {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          
          <button 
            type="button" 
            className={`btn ${puedeRegistrarFallo ? 'btn-primary' : 'btn-disabled'}`}
            onClick={handleConfirmar}
            disabled={!puedeRegistrarFallo}
          >
            Confirmar Fallo
          </button>
        </div>

        {confirmado && (
          <div className="confirmacion-exitosa">
            <p>✅ Fallo registrado exitosamente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalRegistroFallos;