// frontend/src/Joven/components/MisMotivaciones/motivaciones/ListaMotivaciones.jsx
import { useEffect, useState } from "react";
import TarjetaMotivacion from "./TarjetaMotivacion";
import AgregarMotivacion from "./AgregarMotivacion";
import FiltrosMotivaciones from "./FiltrosMotivaciones";
import "./motivaciones.css";

const ListaMotivaciones = ({
  initialMotivaciones = [],
  onEliminar,
  onToggleFavorita,
  onEditar,
  onRequestAgregar
}) => {
  const [motivaciones, setMotivaciones] = useState(initialMotivaciones);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroFavoritas, setFiltroFavoritas] = useState(false);

  // 🔹 Si no hay motivaciones iniciales, carga desde JSON
  useEffect(() => {
    if (initialMotivaciones.length === 0) {
      const cargarDatos = async () => {
        try {
          const response = await fetch("/Joven/fake_data/motivaciones.json");
          const data = await response.json();
          setMotivaciones(data.filter((m) => m.activo === 1));
        } catch (error) {
          console.error("Error cargando motivaciones:", error);
        }
      };
      cargarDatos();
    } else {
      // si se pasan inicialMotivaciones, mantenlas sincronizadas
      setMotivaciones(initialMotivaciones);
    }
  }, [initialMotivaciones]);

  const agregarMotivacion = (nueva) => {
    setMotivaciones((prev) => [nueva, ...prev]);
    setMostrarModal(false);
  };

  const eliminarMotivacion = (id) => {
    setMotivaciones((prev) => prev.filter((m) => m.id !== id));
    onEliminar?.(id);
  };

  const toggleFavorita = (id) => {
    setMotivaciones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, esFavorita: m.esFavorita ? 0 : 1 } : m
      )
    );
    onToggleFavorita?.(id);
  };

  const filtradas = filtroFavoritas
    ? motivaciones.filter((m) => m.esFavorita === 1)
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
            // si el padre quiere manejar agregar globalmente, llama onRequestAgregar
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
