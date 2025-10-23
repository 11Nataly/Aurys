import React, { useState, useRef } from 'react';
import { FaCamera, FaCheck, FaTimes, FaUpload, FaRedo } from 'react-icons/fa';
import Modal from 'react-modal';
import { defaultProfileImage } from '../../../Joven/fake_data/perfilData';
import './ProfileHeader.css';

// Configurar el elemento root para accesibilidad
Modal.setAppElement('#root');

const ProfileHeader = ({ userData, onUpdateUser }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    processImageFile(file);
  };

  const processImageFile = (file) => {
    if (!file) return;

    // Validaciones
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Solo se permiten archivos JPG, PNG o WebP');
      return;
    }

    setError('');
    setSelectedImage(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);
    setIsEditingPhoto(true);
  };

  const handleSavePhoto = () => {
    if (selectedImage) {
      onUpdateUser('fotoPerfil', previewImage);
      setIsEditingPhoto(false);
      setSelectedImage(null);
      setShowConfirmModal(true);
    }
  };

  const handleCancelPhoto = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setIsEditingPhoto(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const removeProfilePhoto = () => {
    onUpdateUser('fotoPerfil', null);
    setPreviewImage(null);
    setShowConfirmModal(true);
  };

  return (
    <div className="profile-header">
      <div className="profile-image-section">
        <div className="profile-image-container">
          <img 
            src={previewImage || userData.fotoPerfil || defaultProfileImage} 
            alt="Foto de perfil" 
            className="profile-image"
          />
        </div>

        <div className="photo-actions">
          {!isEditingPhoto ? (
            <div className="photo-actions-main">
              <button 
                className="photo-action-btn change"
                onClick={triggerFileInput}
                aria-label="Cambiar foto de perfil"
              >
                <FaCamera className="btn-icon" />
                Cambiar foto
              </button>
              
              {(userData.fotoPerfil || previewImage) && (
                <button 
                  className="photo-action-btn remove"
                  onClick={removeProfilePhoto}
                  aria-label="Eliminar foto de perfil"
                >
                  <FaTimes className="btn-icon" />
                  Eliminar
                </button>
              )}
            </div>
          ) : (
            <div className="photo-actions-edit">
              <button 
                className="photo-action-btn save"
                onClick={handleSavePhoto}
                aria-label="Guardar foto"
              >
                <FaCheck className="btn-icon" />
                Guardar
              </button>
              <button 
                className="photo-action-btn cancel"
                onClick={handleCancelPhoto}
                aria-label="Cancelar"
              >
                <FaTimes className="btn-icon" />
                Cancelar
              </button>
              <button 
                className="photo-action-btn retry"
                onClick={triggerFileInput}
                aria-label="Elegir otra foto"
              >
                <FaRedo className="btn-icon" />
                Otra foto
              </button>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept=".jpg,.jpeg,.png,.webp"
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div className="error-message">
          <FaTimes className="error-icon" />
          {error}
        </div>
      )}
      
      <h2 className="profile-name">{userData.nombre}</h2>
      <p className="profile-email">{userData.correo}</p>

      {/* Modal de Confirmación */}
      <Modal
        isOpen={showConfirmModal}
        onRequestClose={closeConfirmModal}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-icon success">✓</div>
          <h3 className="modal-title">¡Foto Actualizada!</h3>
          <p className="modal-message">Tu foto de perfil ha sido actualizada correctamente.</p>
          <div className="modal-actions">
            <button 
              className="modal-btn modal-btn-primary"
              onClick={closeConfirmModal}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;