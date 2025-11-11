// src/components/Papelera/ModalConfirmacion.jsx
import React from "react";
import "./ModalConfirmacion.css";

const ModalConfirmacion = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  titulo = "¿Estás seguro de que quieres eliminar definitivamente este elemento?",
  mensaje = "Esta acción no se puede deshacer.",
  textoConfirmar = "Aceptar",
  textoCancelar = "Cancelar" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Confirmar eliminación</h3>
        </div>
        
        <div className="modal-body">
          <div className="modal-icon">⚠️</div>
          <p className="modal-message">{titulo}</p>
          <p className="modal-submessage">{mensaje}</p>
        </div>
        
        <div className="modal-actions">
          <button 
            className="modal-btn modal-btn-cancel"
            onClick={onCancel}
          >
            {textoCancelar}
          </button>
          <button 
            className="modal-btn modal-btn-confirm"
            onClick={onConfirm}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;