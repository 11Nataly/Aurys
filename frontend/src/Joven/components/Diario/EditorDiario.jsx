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
  <div className="agregar-entrada-componente">
    <div className="componente-header">
      <h2>Editar Entrada</h2>
    </div>

    <div className="componente-body">
      <input
        type="text"
        placeholder="Título de la nota"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="input-titulo"
        disabled={cargando}
      />

      <textarea
        placeholder="Escribe aquí tu contenido..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        className="textarea-contenido"
        rows="12"
        disabled={cargando}
      ></textarea>
    </div>

    <div className="componente-footer">
      <div className="entrada-acciones">
        <button 
          onClick={onCancelar} 
          disabled={!titulo.trim() || !contenido.trim() || cargando}
          className="boton-cancelar"
        >
           cancelar
        </button>

        <button 
          onClick={handleGuardar} 
          disabled={cargando}
          className="boton-guardar"
        >
          guardar
        </button>
      </div>
    </div>
  </div>
);
}

export default EditorDiario;
