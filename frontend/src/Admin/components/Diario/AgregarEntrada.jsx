// src/components/Diario/AgregarEntrada.jsx
import { useState, useEffect } from 'react';
import BotonesAccion from './BotonesAccion';

const AgregarEntrada = ({ entrada, onGuardar, onCancelar }) => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    if (entrada) {
      setTitulo(entrada.titulo);
      setContenido(entrada.contenido);
    } else {
      setTitulo('');
      setContenido('');
    }
  }, [entrada]);

  const handleGuardar = () => {
    const fecha = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    if (entrada) {
      onGuardar({ ...entrada, titulo, contenido });
    } else {
      onGuardar({ titulo, contenido, fecha });
    }
  };

  return (
    <div className="agregar-entrada-componente">
      <div className="componente-header">
        <h2>{entrada ? 'Editar Entrada' : 'Nueva Entrada'}</h2>
      </div>
      
      <div className="componente-body">
        <input
          type="text"
          placeholder="Título de la entrada"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="input-titulo"
        />
        
        <textarea
          placeholder="Escribe tu entrada aquí..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="textarea-contenido"
          rows="12"
        ></textarea>
      </div>
      
      <div className="componente-footer">
        <BotonesAccion 
          onCancelar={onCancelar}
          onGuardar={handleGuardar}
          guardarHabilitado={titulo.trim() && contenido.trim()}
        />
      </div>
    </div>
  );
};

export default AgregarEntrada;