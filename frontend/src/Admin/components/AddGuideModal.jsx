import React, { useState, useRef } from 'react';
import './AddGuideModal.css';
import { useGuideValidation } from './ErroresAdmin/useGuideValidation';

const AddGuideModal = ({ isOpen, onClose }) => {
  const [guideData, setGuideData] = useState({
    title: '',
    description: '',
    instructions: '',
    durationHours: 0,
    durationMinutes: 0,
    durationSeconds: 0
  });

  const [videoFile, setVideoFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    errors,
    touched,
    validateForm,
    handleBlur,
    getFieldError,
    isFieldValid,
    setTouched,
    clearErrors
  } = useGuideValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para los campos de duración, convertir a número
    if (name.includes('duration')) {
      const numericValue = value === '' ? 0 : parseInt(value, 10) || 0;
      setGuideData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setGuideData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error cuando el usuario empiece a escribir
    if (touched[name] && errors[name] && errors[name].length > 0) {
      setTouched(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    
    if (file) {
      setTouched(prev => ({ ...prev, video: true }));
      setTimeout(() => {
        setTouched(prev => ({ ...prev, video: true }));
      }, 100);
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    handleBlur(name, value);
  };

  const handleDurationBlur = () => {
    handleBlur('duration', null, [
      guideData.durationHours,
      guideData.durationMinutes,
      guideData.durationSeconds
    ]);
  };

  const handleSave = () => {
    if (validateForm(guideData, videoFile)) {
      console.log('Guardando guía:', { ...guideData, videoFile });
      onClose();
    } else {
      console.log('Errores de validación:', errors);
    }
  };

  const handleClose = () => {
    setGuideData({
      title: '',
      description: '',
      instructions: '',
      durationHours: 0,
      durationMinutes: 0,
      durationSeconds: 0
    });
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    clearErrors();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className="fas fa-plus-circle"></i> Agregar Nueva Guía</h5>
            <button type="button" className="close" onClick={handleClose}>&times;</button>
          </div>
          <div className="modal-body">
            <form>
              {/* Campo Título */}
              <div className="form-group">
                <label htmlFor="guideTitle" className="form-label">Título *</label>
                <input 
                  type="text" 
                  className={`form-control ${touched.title && !isFieldValid('title') ? 'is-invalid' : ''}`}
                  id="guideTitle" 
                  name="title"
                  value={guideData.title}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  required 
                />
                {touched.title && !isFieldValid('title') && (
                  <div className="invalid-feedback">{getFieldError('title')}</div>
                )}
              </div>

              {/* Campo Descripción */}
              <div className="form-group">
                <label htmlFor="guideContent" className="form-label">Descripción *</label>
                <textarea 
                  className={`form-control ${touched.description && !isFieldValid('description') ? 'is-invalid' : ''}`}
                  id="guideContent" 
                  rows="3" 
                  name="description"
                  value={guideData.description}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  required
                ></textarea>
                {touched.description && !isFieldValid('description') && (
                  <div className="invalid-feedback">{getFieldError('description')}</div>
                )}
                <small className="form-text text-muted">
                  {guideData.description.length}/200 caracteres
                </small>
              </div>

              {/* Campo Instrucciones */}
              <div className="form-group">
                <label htmlFor="guideInstructions" className="form-label">Instrucciones *</label>
                <textarea 
                  className={`form-control ${touched.instructions && !isFieldValid('instructions') ? 'is-invalid' : ''}`}
                  id="guideInstructions" 
                  rows="5" 
                  name="instructions"
                  value={guideData.instructions}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  required
                ></textarea>
                {touched.instructions && !isFieldValid('instructions') && (
                  <div className="invalid-feedback">{getFieldError('instructions')}</div>
                )}
              </div>

              {/* Campo Video */}
              <div className="form-group">
                <label htmlFor="guideVideo" className="form-label">Subir video *</label>
                <input 
                  type="file" 
                  className={`form-control ${touched.video && !isFieldValid('video') ? 'is-invalid' : ''}`}
                  id="guideVideo" 
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                {touched.video && !isFieldValid('video') && (
                  <div className="invalid-feedback">{getFieldError('video')}</div>
                )}
                {videoFile && (
                  <small className="form-text text-muted">
                    Archivo seleccionado: {videoFile.name} ({Math.round(videoFile.size / 1024 / 1024)}MB)
                  </small>
                )}
                <small className="form-text text-muted">
                  Formatos permitidos: MP4, WebM, OGG, MOV - Máximo 50MB
                </small>
              </div>

              {/* Campo Duración - CON INPUTS NUMBER Y FLECHAS */}
              <div className="form-group">
                <label className="form-label">Duración del video *</label>
                <div className="duration-input">
                  <input 
                    type="number" 
                    className={`form-control ${touched.duration && !isFieldValid('duration') ? 'is-invalid' : ''}`}
                    min="0" 
                    max="23" 
                    name="durationHours"
                    value={guideData.durationHours}
                    onChange={handleChange}
                    onBlur={handleDurationBlur}
                  />
                  <span className="duration-separator">:</span>
                  <input 
                    type="number" 
                    className={`form-control ${touched.duration && !isFieldValid('duration') ? 'is-invalid' : ''}`}
                    min="0" 
                    max="59" 
                    name="durationMinutes"
                    value={guideData.durationMinutes}
                    onChange={handleChange}
                    onBlur={handleDurationBlur}
                  />
                  <span className="duration-separator">:</span>
                  <input 
                    type="number" 
                    className={`form-control ${touched.duration && !isFieldValid('duration') ? 'is-invalid' : ''}`}
                    min="0" 
                    max="59" 
                    name="durationSeconds"
                    value={guideData.durationSeconds}
                    onChange={handleChange}
                    onBlur={handleDurationBlur}
                  />
                </div>
                {touched.duration && !isFieldValid('duration') && (
                  <div className="invalid-feedback">{getFieldError('duration')}</div>
                )}
                <small className="form-text text-muted">
                  Formato: Horas (0-23) : Minutos (0-59) : Segundos (0-59)
                </small>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={Object.values(errors).some(error => error.length > 0) && Object.values(touched).every(t => t)}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGuideModal;