import React, { useState, useRef } from "react";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import { editarPerfil } from "../../../services/perfilService";
import { defaultProfileImage } from "../../../Joven/fake_data/perfilData";
import "./ProfileHeader.css";

Modal.setAppElement("#root");

const ProfileHeader = ({ userData, onUpdateUser }) => {
  const [previewImage, setPreviewImage] = useState(userData.foto_perfil || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo no debe superar los 5MB");
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Solo se permiten imágenes JPG, PNG o WEBP");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updated = await editarPerfil(userData.id, {
        nombre: userData.nombre,
        correo: userData.correo,
        foto: selectedFile,
      });

      onUpdateUser("foto_perfil", updated.foto_perfil);
      setModalMessage("Foto de perfil actualizada correctamente");
      setShowModal(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar foto:", error);
      setError("Error al subir la foto");
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewImage(userData.foto_perfil);
    setIsEditing(false);
  };

  return (
    <div className="profile-header">
      <div className="profile-image-section">
        <div className="profile-image-container">
          <img
            src={previewImage || userData.foto_perfil || defaultProfileImage}
            alt="Foto de perfil"
            className="profile-image"
          />
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
          onChange={handleFileSelect}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>

      {error && <p className="error-message">{error}</p>}
      <h2 className="profile-name">{userData.nombre}</h2>
      <p className="profile-email">{userData.correo}</p>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-icon success">✓</div>
          <h3 className="modal-title">¡Éxito!</h3>
          <p className="modal-message">{modalMessage}</p>
          <button
            className="modal-btn modal-btn-primary"
            onClick={() => setShowModal(false)}
          >
            Aceptar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;
