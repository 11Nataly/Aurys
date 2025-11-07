// src/Joven/components/Diario/HistorialEntradas.jsx
import { useState, useEffect } from 'react';
import BuscarEntrada from './BuscarEntrada';
import { obtenerNotasPorUsuario, moverNotaAPapelera } from '../../../services/notasService';
import './HistorialEntradas.css';

const HistorialEntradas = ({ onEditar, onEliminar, onVolver }) => {
  const [entradas, setEntradas] = useState([]);
  const [entradasExpandidas, setEntradasExpandidas] = useState({});
  const [entradasFiltradas, setEntradasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Cargar entradas desde el servicio
  useEffect(() => {
    const cargarNotas = async () => {
      try {
        const id_usuario = localStorage.getItem('id_usuario');

        if (!id_usuario) {
          setError('No se encontró el usuario en el sistema.');
          setCargando(false);
          return;
        }

        // 🔹 Usar el servicio en lugar del fetch manual
        const data = await obtenerNotasPorUsuario(id_usuario);

        setEntradas(data);
        setEntradasFiltradas(data);
      } catch (err) {
        console.error('❌ Error cargando notas:', err);
        // err puede venir con { detail: "..."} o con message
        setError(err?.detail || err?.message || 'No se pudieron cargar las entradas del diario.');
      } finally {
        setCargando(false);
      }
    };

    cargarNotas();
  }, []);

  // 🔹 Mover una entrada a la papelera
  const handleMoverAPapelera = async (id) => {
    const confirmar = window.confirm("¿Quieres mover esta entrada a la papelera?");
    if (!confirmar) return;

    try {
      await moverNotaAPapelera(id);
      // Opcional: llamar callback onEliminar si el padre necesita saberlo
      if (typeof onEliminar === 'function') {
        try { onEliminar(id); } catch (e) { /* no bloquear si el padre falla */ }
      }

      // Actualizar lista local sin la nota movida
      setEntradas((prev) => prev.filter((entrada) => entrada.id !== id));
      setEntradasFiltradas((prev) => prev.filter((entrada) => entrada.id !== id));

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

  if (cargando) {
    return (
      <div className="historial-entradas">
        <p>Cargando entradas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historial-entradas">
        <p className="error">{error}</p>
        <button className="btn-volver" onClick={onVolver}>
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="historial-entradas">
      {/* Encabezado */}
      <div className="historial-header">
        <button className="btn-volver" onClick={onVolver}>
          ← Volver al Diario
        </button>

        <h2>Historial de Entradas</h2>

        <BuscarEntrada entradas={entradas} onResultados={setEntradasFiltradas} />

        <div className="contador-entradas">
          {entradasFiltradas.length}{' '}
          {entradasFiltradas.length === 1 ? 'entrada' : 'entradas'}
        </div>
      </div>

      {/* Si no hay resultados */}
      {entradasFiltradas.length === 0 ? (
        <div className="sin-entradas-container">
          <p className="sin-entradas">
            No hay entradas registradas para este usuario.
          </p>
          <button className="btn-primera-entrada" onClick={onVolver}>
            Crear mi primera entrada
          </button>
        </div>
      ) : (
        // Lista de entradas
        <div className="lista-entradas-compacta">
          {entradasFiltradas.map((entrada) => (
            <div key={entrada.id} className="entrada-compacta">
              {/* Cabecera */}
              <div className="entrada-cabecera">
                <div className="entrada-info">
                  <h3 className="entrada-titulo">{entrada.titulo}</h3>
                  <span className="entrada-fecha">
                    {new Date(entrada.created_at).toLocaleString('es-CO')}
                  </span>
                </div>

                <div className="entrada-acciones">
                  <button
                    className="btn-editar"
                    onClick={() => onEditar(entrada)}
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
                    entradasExpandidas[entrada.id] ? 'expandido' : ''
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
                    {entradasExpandidas[entrada.id] ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialEntradas;
