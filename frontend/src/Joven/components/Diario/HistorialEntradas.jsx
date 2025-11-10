import { useState, useEffect } from "react";
import BuscarEntrada from "./BuscarEntrada";
import EditorDiario from "./EditorDiario";
import { moverNotaAPapelera, editarNota } from "../../../services/notasService";
import "./HistorialEntradas.css";

const HistorialEntradas = ({
  entradas,           // ✅ Entradas paginadas (solo las de la página actual)
  entradasTotales,    // ✅ Todas las entradas (para búsqueda)
  onEliminar,
  onVolver,
}) => {
  const [entradasExpandidas, setEntradasExpandidas] = useState({});
  const [entradasFiltradas, setEntradasFiltradas] = useState([]);
  const [notaEditando, setNotaEditando] = useState(null);
  const [mostrandoEditor, setMostrandoEditor] = useState(false);

  // 🔹 Inicializar con las entradas paginadas
  useEffect(() => {
    setEntradasFiltradas(entradas || []);
  }, [entradas]);

  // 🔹 Buscar en todas las entradas
  const handleBuscarResultados = (resultados) => {
    setEntradasFiltradas(resultados);
  };

  // 🔹 Guardar cambios de edición
  const handleGuardarEdicion = async (notaEditada) => {
  try {
    // 🔹 Validar ID antes de llamar al backend
    if (!notaEditada || !notaEditada.id) {
      console.error("❌ Error: nota sin ID, no se puede editar.");
      alert("No se puede editar esta entrada porque no tiene un ID válido.");
      return;
    }

    // 🔹 Enviar solo los campos que el backend acepta
    const payload = {
      titulo: notaEditada.titulo,
      contenido: notaEditada.contenido,
    };

    const notaActualizada = await editarNota(notaEditada.id, payload);
    alert("Nota actualizada correctamente.");

    // 🔹 Actualizar lista local para reflejar cambios inmediatamente
    setEntradasFiltradas((prev) =>
      prev.map((n) => (n.id === notaEditada.id ? notaActualizada : n))
    );

    setMostrandoEditor(false);
    setNotaEditando(null);
  } catch (error) {
    console.error("Error al guardar la nota editada:", error);
    alert(error?.detail || "No se pudo guardar la edición.");
  }
};


  // 🔹 Mover una entrada a la papelera
  const handleMoverAPapelera = async (id) => {
    const confirmar = window.confirm("¿Quieres mover esta entrada a la papelera?");
    if (!confirmar) return;
    try {
      await moverNotaAPapelera(id);
      if (onEliminar) onEliminar(id);
      alert("Entrada movida a la papelera exitosamente.");
    } catch (err) {
      console.error("❌ Error moviendo a papelera:", err);
      alert(err?.detail || err?.message || "No se pudo mover la entrada a la papelera.");
    }
  };

  // 🔹 Alternar expansión de contenido
  const toggleExpandirEntrada = (id) => {
    setEntradasExpandidas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 🔹 Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  return (
    <div className="historial-entradas">
      {mostrandoEditor ? (
        <EditorDiario
          nota={notaEditando}
          onGuardar={handleGuardarEdicion}
          onCancelar={() => {
            setMostrandoEditor(false);
            setNotaEditando(null);
          }}
        />
      ) : (
        <>
          {/* Encabezado */}
          <div className="historial-header">
            <button className="btn-volver" onClick={onVolver}>
              ← Volver al Diario
            </button>

            <h2>Historial de Entradas</h2>

            {/* 🔹 Búsqueda */}
            <BuscarEntrada
              entradas={entradasTotales || entradas}
              onResultados={handleBuscarResultados}
            />

            <div className="contador-entradas">
              Mostrando {entradasFiltradas.length} de{" "}
              {entradasTotales?.length || entradas.length} entradas
            </div>
          </div>

          {/* Lista */}
          {entradasFiltradas.length === 0 ? (
            <div className="sin-entradas-container">
              <p className="sin-entradas">
                {entradas.length === 0
                  ? "No hay entradas registradas en tu diario."
                  : "No hay entradas que coincidan con tu búsqueda."}
              </p>
              <button className="btn-primera-entrada" onClick={onVolver}>
                Crear nueva entrada
              </button>
            </div>
          ) : (
                <div className="lista-entradas-compacta">
                  {entradasFiltradas.map((entrada, index) => (
                    <div key={entrada.id ?? `entrada-${index}`} className="entrada-compacta">

                      <div className="entrada-cabecera">
                    <div className="entrada-info">
                      <h3 className="entrada-titulo">{entrada.titulo}</h3>
                      <span className="entrada-fecha">
                        {formatearFecha(entrada.created_at)}
                      </span>
                    </div>

                    <div className="entrada-acciones">
                      <button
                        className="btn-editar"
                        onClick={() => {
                          setNotaEditando(entrada);
                          setMostrandoEditor(true);
                        }}
                        title="Editar entrada"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleMoverAPapelera(entrada.id)}
                        title="Mover a papelera"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="entrada-contenido">
                    <p
                      className={`entrada-preview ${
                        entradasExpandidas[entrada.id] ? "expandido" : ""
                      }`}
                    >
                      {entrada.contenido.length > 150 &&
                      !entradasExpandidas[entrada.id]
                        ? `${entrada.contenido.substring(0, 150)}...`
                        : entrada.contenido}
                    </p>

                    {entrada.contenido.length > 150 && (
                      <button
                        className="btn-expandir"
                        onClick={() => toggleExpandirEntrada(entrada.id)}
                      >
                        {entradasExpandidas[entrada.id]
                          ? "Ver menos"
                          : "Ver más"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistorialEntradas;
