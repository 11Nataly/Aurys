// frontend/src/Joven/components/MisMotivaciones/motivaciones/ListaMotivaciones.jsx
import { useEffect, useState } from "react";
import TarjetaMotivacion from "./TarjetaMotivacion";
import AgregarMotivacion from "./AgregarMotivacion";
import FiltrosMotivaciones from "./FiltrosMotivaciones";
import { listarMotivaciones, crearMotivacion } from "../../../../services/motivacionService";
import "./motivaciones.css";

const ListaMotivaciones = ({
  onEliminar,
  onToggleFavorita,
  onEditar,
  onRequestAgregar,
  query,
  setQuery,
}) => {
  const [motivaciones, setMotivaciones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroFavoritas, setFiltroFavoritas] = useState(false);

  // 🔹 Cargar motivaciones al montar el componente
  useEffect(() => {
    const cargarMotivaciones = async () => {
      try {
        const data = await listarMotivaciones();
        setMotivaciones(data);
      } catch (error) {
        console.error("Error cargando motivaciones desde backend:", error);
      }
    };
    cargarMotivaciones();
  }, []);

  // 🔹 Agregar nueva motivación
  const agregarMotivacion = async (nueva) => {
    try {
      await crearMotivacion(nueva);
      const data = await listarMotivaciones();
      setMotivaciones(data);
    } catch (error) {
      console.error("Error agregando motivación:", error);
    } finally {
      setMostrarModal(false);
    }
  };

  // 🔹 Eliminar motivación localmente
  const eliminarMotivacion = (id) => {
    setMotivaciones((prev) => prev.filter((m) => m.id !== id));
    onEliminar?.(id);
  };

  // 🔹 Cambiar favorita localmente
  const toggleFavorita = (id) => {
    setMotivaciones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, esFavorita: !m.esFavorita } : m))
    );
    onToggleFavorita?.(id);
  };

  // 🔹 Filtro favoritas
  const filtradas = filtroFavoritas
    ? motivaciones.filter((m) => m.esFavorita)
    : motivaciones;

  return (
    <div className="motivaciones-panel">
      <div className="motivaciones-header">
        <div>
          <h2>Mis motivaciones</h2>
          <p>Organiza y mantén visibles las razones que te impulsan.</p>
        </div>
        <button
          className="btn-nueva-motivacion"
          onClick={() => {
            if (onRequestAgregar) return onRequestAgregar();
            setMostrarModal(true);
          }}
        >
          + Nueva motivación
        </button>
      </div>

      <FiltrosMotivaciones
        filtroFavoritas={filtroFavoritas}
        setFiltroFavoritas={setFiltroFavoritas}
        query={query}
        setQuery={setQuery}
      />

      <div className="motivaciones-grid">
        {filtradas.map((m) => (
          <TarjetaMotivacion
            key={m.id}
            motivacion={m}
            onEliminar={eliminarMotivacion}
            onFavorita={toggleFavorita}
            onEditar={onEditar}
          />
        ))}
      </div>

      {mostrarModal && (
        <AgregarMotivacion
          onCerrar={() => setMostrarModal(false)}
          onGuardar={agregarMotivacion}
        />
      )}
    </div>
  );
};

export default ListaMotivaciones;
