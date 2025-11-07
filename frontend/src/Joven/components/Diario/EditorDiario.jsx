// src/Joven/components/Diario/EditorDiario.jsx
import React, { useState, useEffect } from 'react';
import './HistorialEntradas.css';

const EditorDiario = ({ nota, onGuardar, onCancelar }) => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [cargando, setCargando] = useState(false);

  // ✅ Cargar datos cuando la nota llega o cambia
  useEffect(() => {
    if (nota) {
      setTitulo(nota.titulo || '');
      setContenido(nota.contenido || '');
    }
  }, [nota]);

  // ✅ Si la nota aún no existe, no renderices los campos
  if (!nota) {
    return (
      <div className="editor-diario-cargando">
        <p>Cargando nota para editar...</p>
      </div>
    );
  }

  const handleGuardar = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      alert('Por favor completa el título y el contenido.');
      return;
    }

    setCargando(true);
    try {
      await onGuardar({ ...nota, titulo, contenido });
    } catch (err) {
      console.error("Error guardando nota:", err);
      alert("No se pudo guardar la nota.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="historial-header">
      <div className="editor-header">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="entrada-titulo-input"
          placeholder="Título de la nota"
        />

        <div className="acciones">
          <button onClick={handleGuardar} disabled={cargando}>
            💾 Guardar
          </button>
          <button onClick={onCancelar} disabled={cargando}>
            ❌ Cancelar
          </button>
        </div>
      </div>

      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        rows="8"
        className="entrada-textarea"
        placeholder="Escribe aquí tu contenido..."
      />
    </div>
  );
};

export default EditorDiario;
