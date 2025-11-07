import React, { useState, useRef } from "react";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import { actualizarFoto } from "../../../services/perfilService";
import { defaultProfileImage } from "../../../Joven/fake_data/perfilData";
import "./ProfileHeader.css";

Modal.setAppElement("#root");

const ProfileHeader = ({ userData, onUpdateUser }) => {
  const [preview, setPreview] = useState(userData.foto_perfil || defaultProfileImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Formato no válido. Use JPG, PNG o WebP");
      return;
    }
    
    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo no debe superar los 5MB");
      return;
    }
    
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setIsEditing(true);
    setError("");
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setError("No hay archivo seleccionado");
      return;
    }

    try {
      console.log("📤 Subiendo foto para usuario:", userData.id);
      const response = await actualizarFoto(userData.id, selectedFile);
      console.log("✅ Foto actualizada:", response);
      
      // Actualizar la foto en el estado principal
      onUpdateUser("foto_perfil", response.url || response.foto_perfil);
      setShowModal(true);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("❌ Error al actualizar foto:", err);
      setError(err.response?.data?.detail || "No se pudo actualizar la foto de perfil.");
    }
  };

  const handleCancel = () => {
    setPreview(userData.foto_perfil || defaultProfileImage);
    setSelectedFile(null);
    setIsEditing(false);
    setError("");
  };

  return (
    <div className="profile-header">
      <div className="profile-image-section">
        <div className="profile-image-container">
          <img src={preview} alt="Foto de perfil" className="profile-image" />
        </div>

        {!isEditing ? (
          <button 
            className="photo-action-btn change" 
            onClick={() => fileInputRef.current.click()}
          >
            <FaCamera /> Cambiar foto
          </button>
        ) : (
          <div className="photo-actions">
            <button className="photo-action-btn save" onClick={handleSave}>
              <FaCheck /> Guardar
            </button>
            <button className="photo-action-btn cancel" onClick={handleCancel}>
              <FaTimes /> Cancelar
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.webp"
          style={{ display: "none" }}
        />
      </div>

      {error && <p className="error-message">{error}</p>}
      <h2 className="profile-name">{userData.nombre}</h2>
      <p className="profile-email">{userData.correo}</p>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-icon success">✓</div>
          <h3 className="modal-title">¡Foto actualizada!</h3>
          <p className="modal-message">Tu foto de perfil ha sido actualizada correctamente.</p>
          <button className="modal-btn modal-btn-primary" onClick={() => setShowModal(false)}>
            Aceptar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;