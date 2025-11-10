// src/Joven/pages/Diario.jsx
import { useState, useEffect } from 'react';
import DiarioHeader from '../components/Diario/DiarioHeader';
import EditorDiario from '../components/Diario/EditorDiario';
import HistorialEntradas from '../components/Diario/HistorialEntradas';
import AgregarEntrada from '../components/Diario/AgregarEntrada';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Pagination from '../components/Pagination/Pagination'; // ✅ 1. IMPORTAR COMPONENTE DE PAGINACIÓN
import '../../styles/diario.css';

const Diario = () => {
  const [vistaActual, setVistaActual] = useState('editor');
  const [entradas, setEntradas] = useState([]);
  const [entradaEditando, setEntradaEditando] = useState(null);
  
  // ✅ 2. ESTADOS PARA CONTROLAR LA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1); // Página actual (empieza en 1)
  const itemsPerPage = 5; // Número fijo de entradas por página

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

  // ✅ 3. CÁLCULO DE LA PAGINACIÓN - LÓGICA PRINCIPAL
  const entradasReversas = [...entradas].reverse(); // Ordenar de más reciente a más antiguo
  const startIndex = (currentPage - 1) * itemsPerPage; // Ej: Página 2 → (2-1)*5 = 5
  const endIndex = startIndex + itemsPerPage; // Ej: 5 + 5 = 10
  const entradasPaginadas = entradasReversas.slice(startIndex, endIndex); // Cortar array para mostrar solo 5 entradas

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

  // ✅ 4. MANEJADOR DE CAMBIO DE PÁGINA - CUANDO EL USUARIO HACE CLIC
  const handlePageChange = (page) => {
    setCurrentPage(page); // Actualizar el estado de la página actual
    // Scroll suave hacia arriba para mejor experiencia de usuario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ 5. RESETEAR PAGINACIÓN AL CAMBIAR DE VISTA
  useEffect(() => {
    if (vistaActual === 'historial') {
      setCurrentPage(1); // Siempre volver a la página 1 al entrar al historial
    }
  }, [vistaActual]);

  const renderVista = () => {
    switch (vistaActual) {
      case 'historial':
        return (
          <div className="historial-container">
            {/* ✅ 6. PASAR LAS ENTRADAS PAGINADAS AL COMPONENTE HIJO */}
            <HistorialEntradas
              entradas={entradasPaginadas} // ✅ Solo las 5 entradas de la página actual
              entradasTotales={entradasReversas} // ✅ Todas las entradas para búsqueda
              onEditar={(entrada) => {
                setEntradaEditando(entrada);
                setVistaActual('agregar');
              }}
              onEliminar={eliminarEntrada}
              onVolver={() => setVistaActual('editor')}
            />
            
            {/* ✅ 7. RENDERIZAR COMPONENTE DE PAGINACIÓN SOLO SI ES NECESARIO */}
            {entradasReversas.length > itemsPerPage && ( // Solo mostrar si hay más de 5 entradas
              <div className="diario-pagination-container">
                <Pagination
                  currentPage={currentPage} // Página actual seleccionada
                  totalItems={entradasReversas.length} // Total de todas las entradas
                  itemsPerPage={itemsPerPage} // 5 entradas por página
                  onPageChange={handlePageChange} // Función que se ejecuta al cambiar página
                  maxVisiblePages={5} // Máximo de números de página visibles
                  className="diario-pagination" // Clase CSS personalizada
                  showTotal={true} // Mostrar "Mostrando X-Y de Z elementos"
                />
              </div>
            )}
          </div>
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