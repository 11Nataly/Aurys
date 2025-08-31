import React, { useState } from 'react';
import './AddGuideModal.css';


const AddGuideModal = ({ isOpen, onClose }) => {
  const [guideData, setGuideData] = useState({
    title: '',
    description: '',
    instructions: '',
    durationHours: '00',
    durationMinutes: '00',
    durationSeconds: '00'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuideData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Lógica para guardar la guía
    console.log('Guardando guía:', guideData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className="fas fa-plus-circle"></i> Agregar Nueva Guía</h5>
            <button type="button" className="close" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="guideTitle" className="form-label">Título</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="guideTitle" 
                  name="title"
                  value={guideData.title}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="guideContent" className="form-label">Descripción</label>
                <textarea 
                  className="form-control" 
                  id="guideContent" 
                  rows="3" 
                  name="description"
                  value={guideData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="guideInstructions" className="form-label">Instrucciones</label>
                <textarea 
                  className="form-control" 
                  id="guideInstructions" 
                  rows="5" 
                  name="instructions"
                  value={guideData.instructions}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="guideVideo" className="form-label">Subir video</label>
                <input type="file" className="form-control" id="guideVideo" accept="video/*" />
              </div>
              <div className="form-group">
                <label className="form-label">Duración del video</label>
                <div className="duration-input">
                  <input 
                    type="number" 
                    className="form-control" 
                    min="0" 
                    max="23" 
                    placeholder="HH" 
                    name="durationHours"
                    value={guideData.durationHours}
                    onChange={handleChange}
                  />
                  <span className="duration-separator">:</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="0" 
                    max="59" 
                    placeholder="MM" 
                    name="durationMinutes"
                    value={guideData.durationMinutes}
                    onChange={handleChange}
                  />
                  <span className="duration-separator">:</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="0" 
                    max="59" 
                    placeholder="SS" 
                    name="durationSeconds"
                    value={guideData.durationSeconds}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGuideModal;