import React, { useState, useEffect } from 'react';
import { promesasData } from '../fake_data/promesasData';
import FormularioPromesa from '../components/Promesas/FormularioPromesa';
import ListaPromesas from '../components/Promesas/ListaPromesas';
import GraficoProgreso from '../components/Promesas/GraficoProgreso';
import ModalConfirmacion from '../components/Promesas/ModalConfirmacion';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Pagination from '../components/Pagination/Pagination';
import '../../styles/Promesas.css';

const Promesas = () => {
  const [promesas, setPromesas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [promesaSeleccionada, setPromesaSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('activas');
  const [modalConfirmacion, setModalConfirmacion] = useState({
    mostrar: false,
    tipo: '',
    promesaId: null,
    titulo: ''
  });

  // ✅ 1. ESTADOS PARA PAGINACIÓN - REDUCIR itemsPerPage PARA VER PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // ✅ Cambiar a 2 para ver paginación con tus 4 promesas

  useEffect(() => {
    // Simular carga de datos
    const todasLasPromesas = [
      ...promesasData.promesasActivas,
      ...promesasData.promesasFinalizadas
    ];
    setPromesas(todasLasPromesas);
    
    // Seleccionar la primera promesa activa por defecto
    const primeraActiva = promesasData.promesasActivas[0];
    if (primeraActiva) {
      setPromesaSeleccionada(primeraActiva);
    }
  }, []);

  // ✅ 2. FILTRAR PROMESAS SEGÚN ESTADO
  const promesasFiltradas = promesas.filter(promesa => {
    if (filtroEstado === 'activas') return promesa.estado === 'activa';
    if (filtroEstado === 'finalizadas') return promesa.estado === 'finalizada';
    return true;
  });

  // ✅ 3. CÁLCULO DE PROMESAS PAGINADAS
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const promesasPaginadas = promesasFiltradas.slice(startIndex, endIndex);

  // ✅ 4. DEBUG: VERIFICAR QUE LA PAGINACIÓN FUNCIONE
  console.log('🔍 DEBUG PAGINACIÓN:', {
    totalPromesas: promesas.length,
    promesasFiltradas: promesasFiltradas.length,
    promesasPaginadas: promesasPaginadas.length,
    currentPage,
    itemsPerPage,
    startIndex,
    endIndex,
    shouldShowPagination: promesasFiltradas.length > itemsPerPage
  });

  // ✅ 5. MANEJADOR DE CAMBIO DE PÁGINA
  const handlePageChange = (page) => {
    console.log('📄 Cambiando a página:', page);
    setCurrentPage(page);
  };

  // ✅ 6. RESETEAR PAGINACIÓN AL CAMBIAR FILTRO
  useEffect(() => {
    console.log('🔄 Reseteando a página 1 por cambio de filtro:', filtroEstado);
    setCurrentPage(1);
  }, [filtroEstado]);

  // ✅ 7. RESETEAR PAGINACIÓN AL CREAR/ELIMINAR PROMESAS
  const handleCrearPromesa = (nuevaPromesa) => {
    const fechaFinalizacion = new Date();
    fechaFinalizacion.setMonth(fechaFinalizacion.getMonth() + 3);

    const promesa = {
      ...nuevaPromesa,
      id: Date.now(),
      estado: 'activa',
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaFinalizacion: fechaFinalizacion.toISOString().split('T')[0],
      progreso: {
        fallosHoy: 0,
        fallosSemana: 0,
        totalFallos: 0,
        diasConsecutivos: 0,
        semanasConsecutivas: 0,
        fallosEstaSemana: 0
      },
      historialFallos: []
    };
    
    const nuevasPromesas = [...promesas, promesa];
    setPromesas(nuevasPromesas);
    
    if (filtroEstado === 'activas') {
      setPromesaSeleccionada(promesa);
    }
    
    setMostrarFormulario(false);
    setCurrentPage(1); // ✅ Resetear paginación
    console.log('✅ Nueva promesa creada, página resetada a 1');
  };

  const handleRegistrarFallo = (promesaId) => {
    setPromesas(promesas.map(promesa => {
      if (promesa.id === promesaId && promesa.estado === 'activa') {
        const nuevoFallo = {
          fecha: new Date().toISOString().split('T')[0],
          hora: new Date().toLocaleTimeString(),
          cantidad: 1
        };
        const promesaActualizada = {
          ...promesa,
          progreso: {
            ...promesa.progreso,
            fallosHoy: (promesa.progreso.fallosHoy || 0) + 1,
            totalFallos: (promesa.progreso.totalFallos || 0) + 1
          },
          historialFallos: [...(promesa.historialFallos || []), nuevoFallo]
        };
        
        if (promesaSeleccionada && promesaSeleccionada.id === promesaId) {
          setPromesaSeleccionada(promesaActualizada);
        }
        
        return promesaActualizada;
      }
      return promesa;
    }));
  };

  const mostrarModalFinalizar = (promesaId, titulo) => {
    setModalConfirmacion({
      mostrar: true,
      tipo: 'finalizar',
      promesaId,
      titulo: `¿Estás seguro de que quieres finalizar la promesa "${titulo}"?`
    });
  };

  const mostrarModalReactivar = (promesaId, titulo) => {
    setModalConfirmacion({
      mostrar: true,
      tipo: 'reactivar',
      promesaId,
      titulo: `¿Quieres reactivar la promesa "${titulo}"?`
    });
  };

  const handleFinalizarPromesa = (promesaId) => {
    setPromesas(promesas.map(promesa => {
      if (promesa.id === promesaId) {
        const promesaFinalizada = {
          ...promesa,
          estado: 'finalizada',
          fechaFinalizacion: new Date().toISOString().split('T')[0]
        };
        
        if (promesaSeleccionada && promesaSeleccionada.id === promesaId) {
          setPromesaSeleccionada(promesaFinalizada);
        }
        
        return promesaFinalizada;
      }
      return promesa;
    }));
    
    setModalConfirmacion({ mostrar: false, tipo: '', promesaId: null, titulo: '' });
  };

  const handleReactivarPromesa = (promesaId) => {
    setPromesas(promesas.map(promesa => {
      if (promesa.id === promesaId) {
        const promesaReactivada = {
          ...promesa,
          estado: 'activa',
          fechaFinalizacion: '2024-12-31'
        };
        
        if (promesaSeleccionada && promesaSeleccionada.id === promesaId) {
          setPromesaSeleccionada(promesaReactivada);
        }
        
        return promesaReactivada;
      }
      return promesa;
    }));
    
    setModalConfirmacion({ mostrar: false, tipo: '', promesaId: null, titulo: '' });
  };

  const handleConfirmacionModal = () => {
    const { tipo, promesaId } = modalConfirmacion;
    
    if (tipo === 'finalizar') {
      handleFinalizarPromesa(promesaId);
    } else if (tipo === 'reactivar') {
      handleReactivarPromesa(promesaId);
    }
  };

  const handleCancelarModal = () => {
    setModalConfirmacion({ mostrar: false, tipo: '', promesaId: null, titulo: '' });
  };

  const handleEditarPromesa = (promesaId, datosActualizados) => {
    setPromesas(promesas.map(promesa => {
      if (promesa.id === promesaId) {
        const promesaActualizada = { ...promesa, ...datosActualizados };
        
        if (promesaSeleccionada && promesaSeleccionada.id === promesaId) {
          setPromesaSeleccionada(promesaActualizada);
        }
        
        return promesaActualizada;
      }
      return promesa;
    }));
  };

  const handleEliminarPromesa = (promesaId) => {
    const nuevasPromesas = promesas.filter(promesa => promesa.id !== promesaId);
    setPromesas(nuevasPromesas);
    
    if (promesaSeleccionada && promesaSeleccionada.id === promesaId) {
      setPromesaSeleccionada(nuevasPromesas.length > 0 ? nuevasPromesas.find(p => p.estado === filtroEstado.slice(0, -1)) || nuevasPromesas[0] : null);
    }
    
    // ✅ Ajustar paginación si es necesario
    if (promesasPaginadas.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="promesas-page">
      <div className="promesas-container">
        <Breadcrumb 
          items={[
            { label: 'Inicio', path: '/joven' },
            { label: 'Promesas', path: '/joven/promesas' }
          ]} 
        />
        
        <div className="promesas-header">
          <div className="header-titles">
            <h1>Promesas</h1>
            <p className="subtitle">Pequeñas promesas, grandes cambios</p>
          </div>
          <button 
            className="btn-nueva-promesa"
            onClick={() => setMostrarFormulario(true)}
          >
            + Nueva Promesa
          </button>
        </div>

        {mostrarFormulario && (
          <FormularioPromesa
            onGuardar={handleCrearPromesa}
            onCancelar={() => setMostrarFormulario(false)}
          />
        )}

        {/* Filtro de Estado */}
        <div className="filtro-container">
          <div className="filtro-estado">
            <button 
              className={`filtro-btn ${filtroEstado === 'activas' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('activas')}
            >
              Promesas activas
              <span className="contador">({promesas.filter(p => p.estado === 'activa').length})</span>
            </button>
            <button 
              className={`filtro-btn ${filtroEstado === 'finalizadas' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('finalizadas')}
            >
              Promesas finalizadas
              <span className="contador">({promesas.filter(p => p.estado === 'finalizada').length})</span>
            </button>
          </div>
        </div>

        {/* Layout de Dos Columnas */}
        <div className="promesas-layout">
          {/* 🟦 Columna izquierda — Panel de promesas CON PAGINACIÓN */}
          <div className="panel-izquierdo">
            <div className="panel-header">
              <h2>
                {filtroEstado === 'activas' ? 'Promesas activas' : 'Promesas finalizadas'}
                {/* ✅ 8. MOSTRAR INFO DE PAGINACIÓN EN EL HEADER */}
                <span className="paginacion-info-header">
                  (Página {currentPage} de {Math.ceil(promesasFiltradas.length / itemsPerPage)})
                </span>
              </h2>
            </div>
            <div className="panel-content">
              {/* ✅ 9. PASAR SOLO LAS PROMESAS PAGINADAS */}
              <ListaPromesas
                promesas={promesasPaginadas}
                onRegistrarFallo={handleRegistrarFallo}
                onFinalizarPromesa={mostrarModalFinalizar}
                onReactivarPromesa={mostrarModalReactivar}
                onEditarPromesa={handleEditarPromesa}
                onEliminarPromesa={handleEliminarPromesa}
                onSeleccionarPromesa={setPromesaSeleccionada}
                promesaSeleccionada={promesaSeleccionada}
                filtroEstado={filtroEstado}
              />
              
              {/* ✅ 10. PAGINACIÓN - AHORA DEBERÍA MOSTRARSE CON itemsPerPage = 2 */}
              {promesasFiltradas.length > itemsPerPage && (
                <div className="promesas-pagination-container">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={promesasFiltradas.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    maxVisiblePages={3}
                    className="promesas-pagination"
                    showTotal={true}
                    showPageNumbers={true}
                    showNavigation={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 🟩 Columna derecha — Panel del gráfico de progreso */}
          <div className="panel-derecho">
            <div className="panel-header">
              <h2>Gráfico de progreso</h2>
              {promesaSeleccionada && (
                <p className="subtitulo-grafico">{promesaSeleccionada.titulo}</p>
              )}
            </div>
            <div className="panel-content">
              {promesaSeleccionada ? (
                <GraficoProgreso 
                  promesa={promesaSeleccionada} 
                />
              ) : (
                <div className="sin-promesa-seleccionada">
                  <p>Selecciona una promesa para ver tu progreso</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Modal de Confirmación */}
        {modalConfirmacion.mostrar && (
          <ModalConfirmacion
            titulo={modalConfirmacion.titulo}
            onConfirmar={handleConfirmacionModal}
            onCancelar={handleCancelarModal}
            tipo={modalConfirmacion.tipo}
          />
        )}
      </div>
    </div>
  );
};

export default Promesas;