// src/pages/Promesas.jsx
import React, { useState, useEffect } from "react";
import FormularioPromesa from "../components/Promesas/FormularioPromesa";
import ListaPromesas from "../components/Promesas/ListaPromesas";
import GraficoProgreso from "../components/Promesas/GraficoProgreso";
import ModalConfirmacion from "../components/Promesas/ModalConfirmacion";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import "../../styles/Promesas.css";

import {
  listarPromesas,
  crearPromesa,
  editarPromesa,
  cambiarEstadoCumplida,
  eliminarPromesa,
} from "../../services/promesaService";
import { registrarFallo } from "../../services/fallosService";

const Promesas = () => {
  const [promesas, setPromesas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [promesaSeleccionada, setPromesaSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("activas");
  const [modalConfirmacion, setModalConfirmacion] = useState({
    mostrar: false,
    tipo: "",
    promesaId: null,
    titulo: "",
  });

  // ✅ Obtener el ID del usuario autenticado desde localStorage
  const usuarioId = parseInt(localStorage.getItem("id_usuario"));

  useEffect(() => {
    const cargarPromesas = async () => {
      try {
        if (!usuarioId) {
          console.error("❌ No se encontró el ID del usuario autenticado");
          return;
        }

        const data = await listarPromesas(usuarioId);
        setPromesas(data);

        if (data.length > 0 && !promesaSeleccionada) {
          setPromesaSeleccionada(data[0]);
        }
      } catch (error) {
        console.error("Error al cargar promesas:", error);
      }
    };
    cargarPromesas();
  }, [usuarioId]);

  const promesasFiltradas = promesas.filter((p) => {
    const esActiva = p.estado === "activo" || p.estado === "En progreso";
    const esFinalizada = p.estado === "finalizada" || p.estado === "Finalizada";
    return filtroEstado === "activas" ? esActiva : esFinalizada;
  });

  const handleCrearPromesa = async (nuevaPromesa) => {
    try {
      const data = { ...nuevaPromesa, usuario_id: usuarioId };
      const response = await crearPromesa(data);
      setPromesas([...promesas, response]);
      setPromesaSeleccionada(response);
      setMostrarFormulario(false);
    } catch (error) {
      alert("Error al crear la promesa");
    }
  };

  const handleRegistrarFallo = async (promesaId, datosActualizados) => {
    setPromesas(prev =>
      prev.map(p => (p.id === promesaId ? { ...p, ...datosActualizados } : p))
    );
    if (promesaSeleccionada?.id === promesaId) {
      setPromesaSeleccionada(prev => ({ ...prev, ...datosActualizados }));
    }
  };

  const handleFinalizarPromesa = async (promesaId) => {
    try {
      await cambiarEstadoCumplida(promesaId, true);
      setPromesas(prev =>
        prev.map(p => (p.id === promesaId ? { ...p, estado: "finalizada" } : p))
      );
    } catch (error) {
      alert("Error al finalizar");
    } finally {
      setModalConfirmacion({ mostrar: false });
    }
  };

  const handleReactivarPromesa = async (promesaId) => {
    try {
      await cambiarEstadoCumplida(promesaId, false);
      setPromesas(prev =>
        prev.map(p => (p.id === promesaId ? { ...p, estado: "activo" } : p))
      );
    } catch (error) {
      alert("Error al reactivar");
    } finally {
      setModalConfirmacion({ mostrar: false });
    }
  };

  const handleConfirmacionModal = () => {
    const { tipo, promesaId } = modalConfirmacion;
    if (tipo === "finalizar") handleFinalizarPromesa(promesaId);
    else if (tipo === "reactivar") handleReactivarPromesa(promesaId);
  };

  const handleEditarPromesa = async (promesaId, datos) => {
    try {
      const response = await editarPromesa(promesaId, datos);

      setPromesas(prev =>
        prev.map(p =>
          p.id === promesaId
            ? {
                ...p,
                ...response,
                estado: p.estado || "activa",
                tipo_frecuencia: response.tipo_frecuencia || p.tipo_frecuencia,
                num_maximo_recaidas:
                  response.num_maximo_recaidas ?? p.num_maximo_recaidas,
              }
            : p
        )
      );

      if (promesaSeleccionada?.id === promesaId) {
        setPromesaSeleccionada(prev => ({
          ...prev,
          ...response,
          tipo_frecuencia: response.tipo_frecuencia || prev.tipo_frecuencia,
          num_maximo_recaidas:
            response.num_maximo_recaidas ?? prev.num_maximo_recaidas,
        }));
      }
    } catch (error) {
      console.error("Error al editar la promesa:", error);
      alert("Error al editar");
    }
  };

  const handleEliminarPromesa = async (promesaId) => {
    if (!window.confirm("¿Mover a la papelera?")) return;
    try {
      await eliminarPromesa(promesaId);
      const nuevas = promesas.filter(p => p.id !== promesaId);
      setPromesas(nuevas);
      if (promesaSeleccionada?.id === promesaId) {
        setPromesaSeleccionada(nuevas[0] || null);
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="promesas-page">
      <div className="promesas-container">
        <Breadcrumb
          items={[
            { label: "Inicio", path: "/joven" },
            { label: "Promesas", path: "/joven/promesas" },
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

        <div className="filtro-container">
          <div className="filtro-estado">
            <button
              className={`filtro-btn ${
                filtroEstado === "activas" ? "active" : ""
              }`}
              onClick={() => setFiltroEstado("activas")}
            >
              Activas ({promesas.filter(p => p.estado === "activo").length})
            </button>
            <button
              className={`filtro-btn ${
                filtroEstado === "finalizadas" ? "active" : ""
              }`}
              onClick={() => setFiltroEstado("finalizadas")}
            >
              Finalizadas ({
                promesas.filter(p => p.estado === "finalizada").length
              })
            </button>
          </div>
        </div>

        <div className="promesas-layout">
          <div className="panel-izquierdo">
            <div className="panel-header">
              <h2>
                {filtroEstado === "activas"
                  ? "Promesas activas"
                  : "Promesas finalizadas"}
              </h2>
            </div>
            <div className="panel-content">
              <ListaPromesas
                promesas={promesasFiltradas}
                onRegistrarFallo={handleRegistrarFallo}
                onFinalizarPromesa={(id, titulo) =>
                  setModalConfirmacion({
                    mostrar: true,
                    tipo: "finalizar",
                    promesaId: id,
                    titulo: `¿Finalizar "${titulo}"?`,
                  })
                }
                onReactivarPromesa={(id, titulo) =>
                  setModalConfirmacion({
                    mostrar: true,
                    tipo: "reactivar",
                    promesaId: id,
                    titulo: `¿Reactivar "${titulo}"?`,
                  })
                }
                onEditarPromesa={handleEditarPromesa}
                onEliminarPromesa={handleEliminarPromesa}
                onSeleccionarPromesa={setPromesaSeleccionada}
                promesaSeleccionada={promesaSeleccionada}
                filtroEstado={filtroEstado}
              />
            </div>
          </div>

          <div className="panel-derecho">
            <div className="panel-header">
              <h2>Gráfico de progreso</h2>
              {promesaSeleccionada && (
                <p className="subtitulo-grafico">
                  {promesaSeleccionada.titulo}
                </p>
              )}
            </div>
            <div className="panel-content">
              {promesaSeleccionada ? (
                <GraficoProgreso promesa={promesaSeleccionada} />
              ) : (
                <div className="sin-promesa-seleccionada">
                  <p>Selecciona una promesa para ver su progreso</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {modalConfirmacion.mostrar && (
          <ModalConfirmacion
            titulo={modalConfirmacion.titulo}
            onConfirmar={handleConfirmacionModal}
            onCancelar={() => setModalConfirmacion({ mostrar: false })}
            tipo={modalConfirmacion.tipo}
          />
        )}
      </div>
    </div>
  );
};

export default Promesas;
