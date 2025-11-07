import React, { useState } from 'react';
import './FormularioPromesa.css';

const FormularioPromesa = ({ onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    frecuencia: '',
    fallosPermitidos: 1
  });
  const [errores, setErrores] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio';
    }

    if (!formData.frecuencia) {
      nuevosErrores.frecuencia = 'Debe seleccionar una frecuencia';
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
      setFormData({ titulo: '', descripcion: '', frecuencia: '', fallosPermitidos: 1 });
    }
  };

  const handleCancelar = () => {
    setFormData({ titulo: '', descripcion: '', frecuencia: '', fallosPermitidos: 1 });
    setErrores({});
    onCancelar();
  };

  return (
    <div className="formulario-promesa-overlay">
      <div className="formulario-promesa">
        <h2>Crear Nueva Promesa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título de la promesa *</label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className={errores.titulo ? 'error' : ''}
              placeholder="Ej: No fumar cigarrillos"
            />
            {errores.titulo && <span className="error-message">{errores.titulo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Breve descripción de tu promesa..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Frecuencia *</label>
            <div className="frecuencia-options">
              {['diaria', 'semanal', 'situacional'].map(frecuencia => (
                <label key={frecuencia} className="radio-label">
                  <input
                    type="radio"
                    value={frecuencia}
                    checked={formData.frecuencia === frecuencia}
                    onChange={(e) => setFormData({...formData, frecuencia: e.target.value})}
                  />
                  <span className="radio-custom"></span>
                  {frecuencia.charAt(0).toUpperCase() + frecuencia.slice(1)}
                </label>
              ))}
            </div>
            {errores.frecuencia && <span className="error-message">{errores.frecuencia}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fallosPermitidos">Fallos permitidos *</label>
            <input
              type="number"
              id="fallosPermitidos"
              min="1"
              value={formData.fallosPermitidos}
              onChange={(e) => setFormData({...formData, fallosPermitidos: parseInt(e.target.value)})}
              className={errores.fallosPermitidos ? 'error' : ''}
            />
            {errores.fallosPermitidos && <span className="error-message">{errores.fallosPermitidos}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar Promesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPromesa;