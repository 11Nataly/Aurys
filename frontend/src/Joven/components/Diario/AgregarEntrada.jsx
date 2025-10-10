// src/Joven/components/Diario/AgregarEntrada.jsx
import { useState, useEffect } from 'react';
import BotonesAccion from './BotonesAccion';
import { crearNota } from '../../../services/notasService';

const AgregarEntrada = ({ entrada, onGuardar, onCancelar }) => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (entrada) {
      setTitulo(entrada.titulo);
      setContenido(entrada.contenido);
    } else {
      setTitulo('');
      setContenido('');
    }
  }, [entrada]);

  const handleGuardar = async () => {
    if (!titulo.trim() || !contenido.trim()) return;
    setCargando(true);

    try {
      // 🔹 Obtener usuario_id del localStorage
      const usuario_id = localStorage.getItem('id_usuario');

      if (!usuario_id) {
        alert("No se encontró el usuario en el sistema.");
        return;
      }

      // 🔹 Crear nueva nota
      const nuevaNota = {
        usuario_id: parseInt(usuario_id),
        titulo,
        contenido,
      };

      const respuesta = await crearNota(nuevaNota);
      console.log("[frontend] Nota creada:", respuesta);

      onGuardar(respuesta); // actualizar lista de notas en el componente padre

    } catch (err) {
      console.error("❌ Error guardando nota:", err);
      alert(err.detail || "Error al guardar la nota");
    } finally {
      setCargando(false);
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
          disabled={cargando}
        />

        <textarea
          placeholder="Escribe tu entrada aquí..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="textarea-contenido"
          rows="12"
          disabled={cargando}
        ></textarea>
      </div>

      <div className="componente-footer">
        <BotonesAccion 
          onCancelar={onCancelar}
          onGuardar={handleGuardar}
          guardarHabilitado={titulo.trim() && contenido.trim() && !cargando}
        />
      </div>
    </div>
  );
};

export default AgregarEntrada;
