import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  icon, 
  message, 
  confirmText = "Confirmar" 
}) => {
  const modalRef = useRef();

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cm-modal-open');
    } else {
      document.body.classList.remove('cm-modal-open');
    }
    
    return () => {
      document.body.classList.remove('cm-modal-open');
    };
  }, [isOpen]);

  // Cerrar modal al hacer clic fuera del contenido
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="cm-modal">
      <div className="cm-modal-dialog">
        <div className="cm-modal-content" ref={modalRef}>
          <div className="cm-modal-header">
            <h5 className="cm-modal-title">
              <i className={`fas fa-${icon}`}></i> {title}
            </h5>
            <button type="button" className="cm-close" onClick={onClose}>&times;</button>
          </div>
          <div className="cm-modal-body">
            <p>{message}</p>
          </div>
          <div className="cm-modal-footer">
            <button type="button" className="cm-btn cm-btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="cm-btn cm-btn-danger" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;