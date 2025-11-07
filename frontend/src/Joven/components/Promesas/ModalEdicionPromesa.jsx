import React, { useState, useEffect } from 'react';
import './ModalEdicionPromesa.css';

const ModalEdicionPromesa = ({ promesa, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fallosPermitidos: 1
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setFormData({
      titulo: promesa.titulo,
      descripcion: promesa.descripcion || '',
      fallosPermitidos: promesa.fallosPermitidos
    });
  }, [promesa]);

  // Verificar si hay historial de fallos
  const tieneHistorialFallos = () => {
    return promesa.historialFallos && promesa.historialFallos.length > 0;
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio';
    }

    if (!formData.fallosPermitidos || formData.fallosPermitidos < 1) {
      nuevosErrores.fallosPermitidos = 'Debe permitir al menos 1 fallo';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onGuardar(formData);
    }
  };

  const handleCancelar = () => {
    // Restaurar valores originales
    setFormData({
      titulo: promesa.titulo,
      descripcion: promesa.descripcion || '',
      fallosPermitidos: promesa.fallosPermitidos
    });
    setErrores({});
    onCancelar();
  };

  const obtenerMensajeFallosPermitidos = () => {
    if (tieneHistorialFallos()) {
      return "No puedes modificar los fallos permitidos porque ya existen registros de fallos. Esto asegura la integridad de tus gráficas de progreso.";
    }
    return "Puedes ajustar el número máximo de fallos permitidos.";
  };

  return (
    <div className="modal-edicion-overlay">
      <div className="modal-edicion">
        <h2>Editar Promesa</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tituloEdicion">Título de la promesa *</label>
            <input
              type="text"
              id="tituloEdicion"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className={errores.titulo ? 'error' : ''}
              placeholder="Ej: No fumar cigarrillos"
            />
            {errores.titulo && <span className="error-message">{errores.titulo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descripcionEdicion">Descripción</label>
            <textarea
              id="descripcionEdicion"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Breve descripción de tu promesa..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fallosPermitidosEdicion">
              Fallos permitidos {tieneHistorialFallos() && '(No editable)'}
            </label>
            <input
              type="number"
              id="fallosPermitidosEdicion"
              min="1"
              value={formData.fallosPermitidos}
              onChange={(e) => setFormData({...formData, fallosPermitidos: parseInt(e.target.value)})}
              className={errores.fallosPermitidos ? 'error' : ''}
              disabled={tieneHistorialFallos()}
            />
            {errores.fallosPermitidos && (
              <span className="error-message">{errores.fallosPermitidos}</span>
            )}
            
            <div className={`info-message ${tieneHistorialFallos() ? 'advertencia' : 'info'}`}>
              <p>{obtenerMensajeFallosPermitidos()}</p>
              {tieneHistorialFallos() && (
                <p className="detalle-historial">
                  <strong>Fallos registrados:</strong> {promesa.historialFallos.length}
                </p>
              )}
            </div>
          </div>

          <div className="info-adicional">
            <h4>Información de la promesa:</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Frecuencia:</span>
                <span className="info-value">{promesa.frecuencia}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado:</span>
                <span className="info-value">{promesa.estado}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha creación:</span>
                <span className="info-value">
                  {new Date(promesa.fechaCreacion).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Total fallos:</span>
                <span className="info-value">{promesa.progreso.totalFallos || 0}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicionPromesa;