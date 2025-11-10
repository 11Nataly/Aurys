import React, { useState, useEffect } from "react";
import FormularioPromesa from "../components/Promesas/FormularioPromesa";
import ListaPromesas from "../components/Promesas/ListaPromesas";
import GraficoProgreso from "../components/Promesas/GraficoProgreso";
import ModalConfirmacion from "../components/Promesas/ModalConfirmacion";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import "../../styles/Promesas.css";

// ✅ Importamos servicios reales
import { listarPromesas, crearPromesa, editarPromesa } from "../../services/promesaService";
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

  // ✅ Cargar promesas desde el backend al iniciar
  useEffect(() => {
    const cargarPromesas = async () => {
      try {
        const usuarioId = 1; // ⚠️ Ajusta según el usuario logueado
        const data = await listarPromesas(usuarioId);
        setPromesas(data);
        if (data.length > 0) setPromesaSeleccionada(data[0]);
      } catch (error) {
        console.error("⚠️ Error al cargar promesas del backend:", error);
      }
    };
    cargarPromesas();
  }, []);

  // ✅ Filtrar promesas según el estado
  const promesasFiltradas = promesas.filter((promesa) => {
    if (filtroEstado === "activas") return promesa.estado === "En progreso" || promesa.estado === "activo";
    if (filtroEstado === "finalizadas") return promesa.estado === "Finalizada" || promesa.estado === "finalizada";
    return true;
  });

  // ✅ Crear promesa nueva (conexión backend)
  const handleCrearPromesa = async (nuevaPromesa) => {
    try {
      const usuarioId = 1;
      const promesaData = { ...nuevaPromesa, usuario_id: usuarioId };
      const response = await crearPromesa(promesaData);
      setPromesas([...promesas, response]);
      setMostrarFormulario(false);
      setPromesaSeleccionada(response);
    } catch (error) {
      console.error("❌ Error al crear promesa:", error);
      alert("No se pudo crear la promesa");
    }
  };

  // ✅ Registrar fallo (backend + fallback local)
  const handleRegistrarFallo = async (promesaId) => {
    try {
      const falloData = {
        promesa_id: promesaId,
        descripcion: "Fallo registrado desde el frontend",
      };
      const response = await registrarFallo(falloData);

      console.log("✅ Fallo registrado:", response);

      // 🔹 Actualizamos promesa en la lista
      setPromesas((prev) =>
        prev.map((p) =>
          p.id === promesaId
            ? {
                ...p,
                progreso: response.progreso,
                historialFallos: response.historialFallos,
              }
            : p
        )
      );

      // 🔹 Si la promesa seleccionada es la misma, actualizamos también
      if (promesaSeleccionada?.id === promesaId) {
        setPromesaSeleccionada((prev) => ({
          ...prev,
          progreso: response.progreso,
          historialFallos: response.historialFallos,
        }));
      }

      alert("Fallo registrado correctamente");
    } catch (error) {
      console.warn("⚠️ No se pudo registrar el fallo en el backend:", error);

      // 🔸 Fallback local
      setPromesas((prev) =>
        prev.map((p) => {
          if (p.id === promesaId && p.estado === "activo") {
            const nuevoFallo = {
              fecha: new Date().toISOString().split("T")[0],
              hora: new Date().toLocaleTimeString(),
              cantidad: 1,
            };
            const pAct = {
              ...p,
              progreso: {
                ...p.progreso,
                fallosHoy: (p.progreso?.fallosHoy || 0) + 1,
                totalFallos: (p.progreso?.totalFallos || 0) + 1,
              },
              historialFallos: [...(p.historialFallos || []), nuevoFallo],
            };
            if (promesaSeleccionada?.id === promesaId) setPromesaSeleccionada(pAct);
            return pAct;
          }
          return p;
        })
      );
    }
  };

  // ✅ Finalizar / reactivar / eliminar promesas
  const mostrarModalFinalizar = (promesaId, titulo) => {
    setModalConfirmacion({
      mostrar: true,
      tipo: "finalizar",
      promesaId,
      titulo: `¿Estás seguro de que quieres finalizar la promesa "${titulo}"?`,
    });
  };

  const mostrarModalReactivar = (promesaId, titulo) => {
    setModalConfirmacion({
      mostrar: true,
      tipo: "reactivar",
      promesaId,
      titulo: `¿Quieres reactivar la promesa "${titulo}"?`,
    });
  };

  const handleFinalizarPromesa = (promesaId) => {
    setPromesas((prev) =>
      prev.map((p) =>
        p.id === promesaId
          ? { ...p, estado: "finalizada", fechaFinalizacion: new Date().toISOString().split("T")[0] }
          : p
      )
    );
    setModalConfirmacion({ mostrar: false, tipo: "", promesaId: null, titulo: "" });
  };

  const handleReactivarPromesa = (promesaId) => {
    setPromesas((prev) =>
      prev.map((p) =>
        p.id === promesaId ? { ...p, estado: "activo", fechaFinalizacion: "2024-12-31" } : p
      )
    );
    setModalConfirmacion({ mostrar: false, tipo: "", promesaId: null, titulo: "" });
  };

  const handleConfirmacionModal = () => {
    const { tipo, promesaId } = modalConfirmacion;
    if (tipo === "finalizar") handleFinalizarPromesa(promesaId);
    else if (tipo === "reactivar") handleReactivarPromesa(promesaId);
  };

  const handleCancelarModal = () => {
    setModalConfirmacion({ mostrar: false, tipo: "", promesaId: null, titulo: "" });
  };

  const handleEditarPromesa = async (promesaId, datosActualizados) => {
    try {
      const response = await editarPromesa(promesaId, datosActualizados);
      setPromesas((prev) => prev.map((p) => (p.id === promesaId ? response : p)));
      if (promesaSeleccionada?.id === promesaId) setPromesaSeleccionada(response);
    } catch (error) {
      console.error("Error al editar promesa:", error);
    }
  };

  const handleEliminarPromesa = (promesaId) => {
    const nuevasPromesas = promesas.filter((p) => p.id !== promesaId);
    setPromesas(nuevasPromesas);
    if (promesaSeleccionada?.id === promesaId) {
      setPromesaSeleccionada(nuevasPromesas[0] || null);
    }
  };

  // ✅ Renderizado
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
          <button className="btn-nueva-promesa" onClick={() => setMostrarFormulario(true)}>
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
              className={`filtro-btn ${filtroEstado === "activas" ? "active" : ""}`}
              onClick={() => setFiltroEstado("activas")}
            >
              Promesas activas
              <span className="contador">
                ({promesas.filter((p) => p.estado === "En progreso" || p.estado === "activo").length})
              </span>
            </button>
            <button
              className={`filtro-btn ${filtroEstado === "finalizadas" ? "active" : ""}`}
              onClick={() => setFiltroEstado("finalizadas")}
            >
              Promesas finalizadas
              <span className="contador">
                ({promesas.filter((p) => p.estado === "Finalizada" || p.estado === "finalizada").length})
              </span>
            </button>
          </div>
        </div>

        <div className="promesas-layout">
          <div className="panel-izquierdo">
            <div className="panel-header">
              <h2>
                {filtroEstado === "activas" ? "Promesas activas" : "Promesas finalizadas"}
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

          <div className="panel-derecho">
            <div className="panel-header">
              <h2>Gráfico de progreso</h2>
              {promesaSeleccionada && (
                <p className="subtitulo-grafico">{promesaSeleccionada.titulo}</p>
              )}
            </div>
            <div className="panel-content">
              {promesaSeleccionada ? (
                <GraficoProgreso promesa={promesaSeleccionada} />
              ) : (
                <div className="sin-promesa-seleccionada">
                  <p>Selecciona una promesa para ver tu progreso</p>
                </div>
              )}
            </div>
          </div>
        </div>

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
