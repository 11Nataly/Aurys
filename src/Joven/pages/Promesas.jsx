import React, { useState, useEffect } from 'react';
import { promesasData } from '../FakeData/promesasData';
import FormularioPromesa from '../components/Promesas/FormularioPromesa';
import ListaPromesas from '../components/Promesas/ListaPromesas';
import GraficoProgreso from '../components/Promesas/GraficoProgreso';
import ModalConfirmacion from '../components/Promesas/ModalConfirmacion';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import '../../styles/Promesas.css';

const Promesas = () => {
  const [promesas, setPromesas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [promesaSeleccionada, setPromesaSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('activas'); // 'activas', 'finalizadas'
  const [modalConfirmacion, setModalConfirmacion] = useState({
    mostrar: false,
    tipo: '', // 'finalizar', 'reactivar'
    promesaId: null,
    titulo: ''
  });

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

  // Filtrar promesas según el estado seleccionado
  const promesasFiltradas = promesas.filter(promesa => {
    if (filtroEstado === 'activas') return promesa.estado === 'activa';
    if (filtroEstado === 'finalizadas') return promesa.estado === 'finalizada';
    return true;
  });

  const handleCrearPromesa = (nuevaPromesa) => {
    const promesa = {
      ...nuevaPromesa,
      id: Date.now(),
      estado: 'activa',
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaFinalizacion: '2024-12-31',
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
    
    // Si estamos en activas, seleccionar la nueva promesa
    if (filtroEstado === 'activas') {
      setPromesaSeleccionada(promesa);
    }
    
    setMostrarFormulario(false);
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
        
        // Si la promesa finalizada estaba seleccionada, mantenerla seleccionada pero actualizada
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
        
        // Si la promesa reactivada estaba seleccionada, actualizarla
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
        
        {/* 🟣 Encabezado general de la página */}
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
          {/* 🟦 Columna izquierda — Panel de promesas */}
          <div className="panel-izquierdo">
            <div className="panel-header">
              <h2>
                {filtroEstado === 'activas' ? 'Promesas activas' : 'Promesas finalizadas'}
              </h2>
            </div>
            <div className="panel-content">
              <ListaPromesas
                promesas={promesasFiltradas}
                onRegistrarFallo={handleRegistrarFallo}
                onFinalizarPromesa={mostrarModalFinalizar}
                onReactivarPromesa={mostrarModalReactivar}
                onEditarPromesa={handleEditarPromesa}
                onEliminarPromesa={handleEliminarPromesa}
                onSeleccionarPromesa={setPromesaSeleccionada}
                promesaSeleccionada={promesaSeleccionada}
                filtroEstado={filtroEstado}
              />
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