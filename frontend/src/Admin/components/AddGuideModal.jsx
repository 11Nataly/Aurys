import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./AddGuideModal.css";

const AddGuideModal = ({ isOpen, onClose, onSave, guideData, mode = "add" }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    durationHours: 0,
    durationMinutes: 0,
    durationSeconds: 0,
  });

  const [videoFile, setVideoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const modalRef = useRef();

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("agm-modal-open");

      // Si estamos en modo edición, cargar los datos de la guía
      if (mode === "edit" && guideData) {
        setFormData({
          title: guideData.title || "",
          description: guideData.description || "",
          instructions: guideData.instructions || "",
          durationHours: guideData.durationHours || 0,
          durationMinutes: guideData.durationMinutes || 0,
          durationSeconds: guideData.durationSeconds || 0,
        });
      }
    } else {
      document.body.classList.remove("agm-modal-open");
    }

    return () => {
      document.body.classList.remove("agm-modal-open");
    };
  }, [isOpen, mode, guideData]);

  // Cerrar modal al hacer clic fuera del contenido
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("duration")) {
      const numericValue = value === "" ? 0 : parseInt(value, 10) || 0;
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    } else if (formData.description.length > 200) {
      newErrors.description =
        "La descripción no puede tener más de 200 caracteres";
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = "Las instrucciones son obligatorias";
    }

    if (
      formData.durationHours === 0 &&
      formData.durationMinutes === 0 &&
      formData.durationSeconds === 0
    ) {
      newErrors.duration = "La duración debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData, videoFile); // ✅ ahora también pasa el video
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      instructions: "",
      durationHours: 0,
      durationMinutes: 0,
      durationSeconds: 0,
    });
    setVideoFile(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="agm-modal">
      <div className="agm-modal-dialog">
        <div className="agm-modal-content" ref={modalRef}>
          <div className="agm-modal-header">
            <h5 className="agm-modal-title">
              <i className="fas fa-plus-circle"></i>
              {mode === "add" ? " Agregar Nueva Guía" : " Editar Guía"}
            </h5>
            <button type="button" className="agm-close" onClick={handleClose}>
              &times;
            </button>
          </div>
          <div className="agm-modal-body">
            <form>
              {/* Campo Título */}
              <div className="agm-form-group">
                <label htmlFor="guideTitle" className="agm-form-label">
                  Título *
                </label>
                <input
                  type="text"
                  className={`agm-form-control ${
                    errors.title ? "agm-is-invalid" : ""
                  }`}
                  id="guideTitle"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                {errors.title && (
                  <div className="agm-invalid-feedback">{errors.title}</div>
                )}
              </div>

              {/* Campo Descripción */}
              <div className="agm-form-group">
                <label htmlFor="guideContent" className="agm-form-label">
                  Descripción *
                </label>
                <textarea
                  className={`agm-form-control ${
                    errors.description ? "agm-is-invalid" : ""
                  }`}
                  id="guideContent"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
                {errors.description && (
                  <div className="agm-invalid-feedback">
                    {errors.description}
                  </div>
                )}
                <small className="agm-form-text">
                  {formData.description.length}/200 caracteres
                </small>
              </div>

              {/* Campo Instrucciones */}
              <div className="agm-form-group">
                <label
                  htmlFor="guideInstructions"
                  className="agm-form-label"
                >
                  Instrucciones *
                </label>
                <textarea
                  className={`agm-form-control ${
                    errors.instructions ? "agm-is-invalid" : ""
                  }`}
                  id="guideInstructions"
                  rows="5"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                ></textarea>
                {errors.instructions && (
                  <div className="agm-invalid-feedback">
                    {errors.instructions}
                  </div>
                )}
              </div>

              {/* Campo Video */}
              <div className="agm-form-group">
                <label htmlFor="guideVideo" className="agm-form-label">
                  Subir video
                </label>
                <input
                  type="file"
                  className="agm-form-control"
                  id="guideVideo"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                {videoFile && (
                  <small className="agm-form-text">
                    Archivo seleccionado: {videoFile.name} (
                    {Math.round(videoFile.size / 1024 / 1024)}MB)
                  </small>
                )}
                <small className="agm-form-text">
                  Formatos permitidos: MP4, WebM, OGG, MOV - Máximo 50MB
                </small>
              </div>

              {/* Campo Duración */}
              <div className="agm-form-group">
                <label className="agm-form-label">
                  Duración del video *
                </label>
                <div className="agm-duration-input">
                  <input
                    type="number"
                    className={`agm-form-control ${
                      errors.duration ? "agm-is-invalid" : ""
                    }`}
                    min="0"
                    max="23"
                    name="durationHours"
                    value={formData.durationHours}
                    onChange={handleChange}
                  />
                  <span className="agm-duration-separator">:</span>
                  <input
                    type="number"
                    className={`agm-form-control ${
                      errors.duration ? "agm-is-invalid" : ""
                    }`}
                    min="0"
                    max="59"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                  />
                  <span className="agm-duration-separator">:</span>
                  <input
                    type="number"
                    className={`agm-form-control ${
                      errors.duration ? "agm-is-invalid" : ""
                    }`}
                    min="0"
                    max="59"
                    name="durationSeconds"
                    value={formData.durationSeconds}
                    onChange={handleChange}
                  />
                </div>
                {errors.duration && (
                  <div className="agm-invalid-feedback">{errors.duration}</div>
                )}
                <small className="agm-form-text">
                  Formato: Horas (0-23) : Minutos (0-59) : Segundos (0-59)
                </small>
              </div>
            </form>
          </div>
          <div className="agm-modal-footer">
            <button
              type="button"
              className="agm-btn agm-btn-secondary"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="agm-btn agm-btn-primary"
              onClick={handleSave}
            >
              {mode === "add" ? "Agregar" : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddGuideModal;
