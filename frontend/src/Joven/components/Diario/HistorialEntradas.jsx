// src/Joven/components/Diario/HistorialEntradas.jsx
import { useState, useEffect } from 'react';
import BuscarEntrada from './BuscarEntrada';
import EditorDiario from "./EditorDiario";
import { moverNotaAPapelera, editarNota } from '../../../services/notasService';
import './HistorialEntradas.css';

const HistorialEntradas = ({ 
  entradas,           // ✅ Entradas paginadas (solo las de la página actual)
  entradasTotales,    // ✅ Todas las entradas (para búsqueda/filtros)
  onEditar, 
  onEliminar, 
  onVolver 
}) => {
  const [entradasExpandidas, setEntradasExpandidas] = useState({});
  const [entradasFiltradas, setEntradasFiltradas] = useState([]);
  const [mostrandoEditor, setMostrandoEditor] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);

  // ✅ 1. INICIALIZAR CON LAS ENTRADAS PAGINADAS
  useEffect(() => {
    setEntradasFiltradas(entradas || []);
  }, [entradas]);

  // ✅ 2. FUNCIÓN PARA FORMATEAR FECHAS - DEFINIDA CORRECTAMENTE
  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    
    // Si ya es una cadena formateada correctamente
    if (typeof fecha === 'string' && !fecha.includes('Invalid')) {
      return fecha;
    }
    
    try {
      // Si viene del servicio con created_at
      if (fecha.created_at) {
        return new Date(fecha.created_at).toLocaleString("es-CO", {
          day: 'numeric',
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Si es un timestamp o string de fecha
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return "Fecha no disponible";
      }
      
      return fechaObj.toLocaleDateString("es-CO", {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha no disponible";
    }
  };

  // 🔹 Manejar búsqueda - buscar en todas las entradas
  const handleBuscarResultados = (resultados) => {
    setEntradasFiltradas(resultados);
  };

  // 🔹 Guardar cambios de edición
  const handleGuardarEdicion = async (notaEditada) => {
    try {
      // Si estás usando el servicio de notas, llamar a la API
      // await editarNota(notaEditada.id, notaEditada);
      
      // Llamar a la función de edición del padre
      if (onEditar) {
        onEditar(notaEditada);
      }
      
      setMostrandoEditor(false);
      setNotaEditando(null);
    } catch (error) {
      console.error("Error al guardar la nota editada:", error);
      alert("No se pudo guardar la edición.");
    }
  };

  // 🔹 Mover una entrada a la papelera
  const handleMoverAPapelera = async (id) => {
    const confirmar = window.confirm("¿Quieres mover esta entrada a la papelera?");
    if (!confirmar) return;
    try {
      // Si estás usando el servicio de notas, llamar a la API
      // await moverNotaAPapelera(id);
      
      // Llamar a la función de eliminación del padre
      if (onEliminar) {
        onEliminar(id);
      }
      
      alert("Entrada movida a la papelera exitosamente.");
    } catch (err) {
      console.error("❌ Error moviendo a papelera:", err);
      alert(err?.detail || err?.message || "No se pudo mover la entrada a la papelera.");
    }
  };

  // 🔹 Alternar expansión de una entrada
  const toggleExpandirEntrada = (id) => {
    setEntradasExpandidas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

            {/* ✅ 3. BÚSQUEDA EN TODAS LAS ENTRADAS */}
            <BuscarEntrada
              entradas={entradasTotales || entradas}
              onResultados={handleBuscarResultados}
            />

            <div className="contador-entradas">
              {/* ✅ 4. MOSTRAR CONTADOR CON INFORMACIÓN DE PAGINACIÓN */}
              Mostrando {entradasFiltradas.length} de {entradasTotales?.length || entradas.length} entradas
            </div>
          </div>

          {/* ✅ 5. RENDERIZAR SOLO LAS ENTRADAS FILTRADAS/PAGINADAS */}
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
            // ✅ 6. LISTA DE ENTRADAS - SOLO LAS DE LA PÁGINA ACTUAL
            <div className="lista-entradas-compacta">
              {entradasFiltradas.map((entrada) => (
                <div key={entrada.id} className="entrada-compacta">
                  {/* Cabecera */}
                  <div className="entrada-cabecera">
                    <div className="entrada-info">
                      <h3 className="entrada-titulo">{entrada.titulo}</h3>
                      {/* ✅ 7. USAR LA FUNCIÓN formatearFecha DEFINIDA ARRIBA */}
                      <span className="entrada-fecha">
                        {formatearFecha(entrada.fecha || entrada.created_at)}
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

                  {/* Contenido */}
                  <div className="entrada-contenido">
                    <p
                      className={`entrada-preview ${
                        entradasExpandidas[entrada.id] ? "expandido" : ""
                      }`}
                    >
                      {entrada.contenido && entrada.contenido.length > 150 &&
                      !entradasExpandidas[entrada.id]
                        ? `${entrada.contenido.substring(0, 150)}...`
                        : entrada.contenido}
                    </p>

                    {entrada.contenido && entrada.contenido.length > 150 && (
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