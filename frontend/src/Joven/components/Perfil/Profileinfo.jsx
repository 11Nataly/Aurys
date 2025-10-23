import React, { useState } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import './ProfileInfo.css';

Modal.setAppElement('#root');

const ProfileInfo = ({ userData, isEditing, onUpdateUser, onEditToggle }) => {
  const [tempValues, setTempValues] = useState({
    nombre: userData.nombre,
    correo: userData.correo,
    contrasena: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    setTempValues(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'nombre':
        if (!value.trim()) {
          newErrors.nombre = 'El nombre no puede estar vacío';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          newErrors.nombre = 'Solo se permiten letras y espacios';
        } else {
          delete newErrors.nombre;
        }
        break;

      case 'correo':
        if (!value.trim()) {
          newErrors.correo = 'El correo no puede estar vacío';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.correo = 'Formato de correo inválido';
        } else {
          delete newErrors.correo;
        }
        break;

      case 'contrasena':
        if (value && value.length < 6) {
          newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
        } else {
          delete newErrors.contrasena;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (field) => {
    if (validateField(field, tempValues[field])) {
      onUpdateUser(field, tempValues[field]);
      onEditToggle(field);
      
      // Mostrar modal de éxito
      const fieldNames = {
        nombre: 'Nombre',
        correo: 'Correo electrónico',
        contrasena: 'Contraseña'
      };
      setSuccessMessage(`${fieldNames[field]} actualizado correctamente`);
      setShowSuccessModal(true);
      
      // Resetear contraseña después de guardar
      if (field === 'contrasena') {
        setTempValues(prev => ({ ...prev, contrasena: '' }));
      }
    }
  };

  const handleCancel = (field) => {
    setTempValues(prev => ({
      ...prev,
      [field]: field === 'contrasena' ? '' : userData[field]
    }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    onEditToggle(field);
  };

  const handleEditClick = (field) => {
    setTempValues(prev => ({
      ...prev,
      [field]: field === 'contrasena' ? '' : userData[field]
    }));
    onEditToggle(field);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const renderField = (field, label, type = 'text') => (
    <div className="profile-field">
      <label className="field-label">{label}</label>
      <div className="field-input-container">
        {isEditing[field] ? (
          <>
            <input
              type={type}
              value={tempValues[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`field-input ${errors[field] ? 'error' : ''}`}
              placeholder={`Ingresa tu ${label.toLowerCase()}`}
            />
            <div className="field-actions">
              <button
                className="action-btn save"
                onClick={() => handleSave(field)}
                disabled={!!errors[field]}
                aria-label="Guardar"
              >
                <FaCheck />
              </button>
              <button
                className="action-btn cancel"
                onClick={() => handleCancel(field)}
                aria-label="Cancelar"
              >
                <FaTimes />
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="field-value">
              {field === 'contrasena' ? '••••••••••' : userData[field]}
            </span>
            <button
              className="edit-btn"
              onClick={() => handleEditClick(field)}
              aria-label={`Editar ${label}`}
            >
              <FaEdit />
            </button>
          </>
        )}
      </div>
      {errors[field] && <div className="field-error">{errors[field]}</div>}
    </div>
  );

  return (
    <div className="profile-info">
      <h3 className="info-title">Información Personal</h3>
      
      {renderField('nombre', 'Nombre')}
      {renderField('correo', 'Correo Electrónico')}
      {renderField('contrasena', 'Contraseña', 'password')}

      {/* Modal de Éxito */}
      <Modal
        isOpen={showSuccessModal}
        onRequestClose={closeSuccessModal}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-icon success">✓</div>
          <h3 className="modal-title">¡Actualizado!</h3>
          <p className="modal-message">{successMessage}</p>
          <div className="modal-actions">
            <button 
              className="modal-btn modal-btn-primary"
              onClick={closeSuccessModal}
            >
              Continuar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileInfo;