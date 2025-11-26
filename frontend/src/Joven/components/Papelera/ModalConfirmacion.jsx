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
      <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <p>{titulo}</p>
          {mensaje && <p className="modal-submessage">{mensaje}</p>}
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn-cancelar"
            onClick={onCancel}
          >
            {textoCancelar}
          </button>
          <button 
            className="btn-acaptar"
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