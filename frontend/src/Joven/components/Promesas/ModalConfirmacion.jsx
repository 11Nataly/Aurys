import React from 'react';
import './ModalConfirmacion.css';

const ModalConfirmacion = ({ titulo, onConfirmar, onCancelar, tipo }) => {
  const getBotonConfirmarTexto = () => {
    switch (tipo) {
      case 'finalizar':
        return 'Sí, Finalizar';
      case 'reactivar':
        return 'Sí, Reactivar';
      case 'eliminar':
        return 'Sí, Eliminar';
      default:
        return 'Confirmar';
    }
  };

  const getBotonConfirmarClase = () => {
    switch (tipo) {
      case 'finalizar':
        return 'btn-warning';
      case 'reactivar':
        return 'btn-success';
      case 'eliminar':
        return 'btn-danger';
      default:
        return 'btn-primary';
    }
  };

  return (
    <div className="modal-confirmacion-overlay">
      <div className="modal-confirmacion">
        <div className="modal-header">
          <h3>Confirmar acción</h3>
        </div>
        
        <div className="modal-content">
          <p>{titulo}</p>
          
          {tipo === 'finalizar' && (
            <div className="advertencia-finalizar">
              <p>⚠️ Una vez finalizada, no podrás registrar más fallos en esta promesa.</p>
            </div>
          )}
          
          {tipo === 'reactivar' && (
            <div className="info-reactivar">
              <p>🔄 La promesa volverá a estar activa y podrás registrar fallos nuevamente.</p>
            </div>
          )}
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
            className={`btn ${getBotonConfirmarClase()}`}
            onClick={onConfirmar}
          >
            {getBotonConfirmarTexto()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;