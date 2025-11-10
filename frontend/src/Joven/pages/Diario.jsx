// src/Joven/pages/Diario.jsx
import { useState, useEffect } from 'react';
import DiarioHeader from '../components/Diario/DiarioHeader';
import EditorDiario from '../components/Diario/EditorDiario';
import HistorialEntradas from '../components/Diario/HistorialEntradas';
import AgregarEntrada from '../components/Diario/AgregarEntrada';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'; // ✅ Importamos
import '../../styles/diario.css';

const Diario = () => {
  const [vistaActual, setVistaActual] = useState('editor');
  const [entradas, setEntradas] = useState([]);
  const [entradaEditando, setEntradaEditando] = useState(null);

  useEffect(() => {
    const entradasGuardadas = localStorage.getItem('diarioEntradas');
    if (entradasGuardadas) {
      const entradasParseadas = JSON.parse(entradasGuardadas);
      setEntradas(entradasParseadas);
      if (entradasParseadas.length === 0) {
        setVistaActual('agregar');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('diarioEntradas', JSON.stringify(entradas));
  }, [entradas]);

  const agregarEntrada = (nuevaEntrada) => {
    const id = Date.now();
    const fecha = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const entradaCompleta = { id, fecha, ...nuevaEntrada };
    setEntradas([...entradas, entradaCompleta]);
    setVistaActual('editor');
  };

  const editarEntrada = (entradaEditada) => {
    setEntradas(entradas.map(entrada =>
      entrada.id === entradaEditada.id ? { ...entradaEditada, fecha: entrada.fecha } : entrada
    ));
    setVistaActual('editor');
    setEntradaEditando(null);
  };

  const eliminarEntrada = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      setEntradas(entradas.filter(entrada => entrada.id !== id));
      if (entradas.length === 1) {
        setVistaActual('agregar');
      }
    }
  };

  const renderVista = () => {
    switch (vistaActual) {
      case 'historial':
        return (
          <HistorialEntradas
            entradas={[...entradas].reverse()}
            onEditar={(entrada) => {
              setEntradaEditando(entrada);
              setVistaActual('agregar');
            }}
            onEliminar={eliminarEntrada}
            onVolver={() => setVistaActual('editor')}
          />
        );
      case 'agregar':
        return (
          <AgregarEntrada
            entrada={entradaEditando}
            onGuardar={entradaEditando ? editarEntrada : agregarEntrada}
            onCancelar={() => {
              setEntradaEditando(null);
              setVistaActual(entradas.length === 0 ? 'agregar' : 'editor');
            }}
          />
        );
      default:
        return (
          <EditorDiario
            entradas={entradas}
            onAgregarEntrada={() => {
              setEntradaEditando(null);
              setVistaActual('agregar');
            }}
          />
        );
    }
  };

  return (
    <>
      {/* ✅ BREADCRUMB FUERA Y ARRIBA */}
      <Breadcrumb />

      <div className="diario-container">
        <DiarioHeader
          vistaActual={vistaActual}
          onCambiarVista={setVistaActual}
        />
        {renderVista()}
      </div>
    </>
  );
};

export default Diario;