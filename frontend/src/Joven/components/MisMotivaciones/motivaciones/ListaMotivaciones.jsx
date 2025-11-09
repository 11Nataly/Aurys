// frontend/src/joven/components/MisMotivaciones/motivaciones/listarMotivaciones.jsx
import { useEffect, useState, useMemo } from "react";
import TarjetaMotivacion from "./TarjetaMotivacion";
import AgregarMotivacion from "./AgregarMotivacion";
import FiltrosMotivaciones from "./FiltrosMotivaciones";
import {
  listarMotivaciones,
  crearMotivacion,
  cambiarEstadoMotivacion,
  favoritosMotivacion,
} from "../../../../services/motivacionService";
import "./motivaciones.css";

const ListaMotivaciones = ({ onEditar, onRequestAgregar }) => {
  const [motivaciones, setMotivaciones] = useState([]);
  const [motivacionesFiltradas, setMotivacionesFiltradas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroFavoritas, setFiltroFavoritas] = useState(false);

  // 🔹 Cargar motivaciones al montar el componente
  useEffect(() => {
    const cargarMotivaciones = async () => {
      try {
        const data = await listarMotivaciones();
        setMotivaciones(data);
        setMotivacionesFiltradas(data); // ← también guardamos las iniciales para el filtro
      } catch (error) {
        console.error("Error cargando motivaciones:", error);
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
      setMotivacionesFiltradas(data);
    } catch (error) {
      console.error("Error agregando motivación:", error);
    } finally {
      setMostrarModal(false);
    }
  };

  // 🔹 Cambiar favorita localmente
  const toggleFavorita = async (id, esFavorita) => {
    try {
      const nuevaFavorita = !esFavorita;
      await favoritosMotivacion(id, nuevaFavorita);
      setMotivaciones((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, esFavorita: nuevaFavorita } : m
        )
      );
      setMotivacionesFiltradas((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, esFavorita: nuevaFavorita } : m
        )
      );
    } catch (error) {
      console.error("Error cambiando favorito:", error);
    }
  };

  // 🔹 Cambiar estado activo/inactivo (soft delete)
  const toggleEstado = async (id, estadoActual) => {
    try {
      await cambiarEstadoMotivacion(id, !estadoActual);
      setMotivaciones((prev) =>
        prev.filter((m) => (estadoActual ? m.id !== id : true))
      );
      setMotivacionesFiltradas((prev) =>
        prev.filter((m) => (estadoActual ? m.id !== id : true))
      );
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  // 🔹 Aplicar filtro de favoritas
  const listaFinal = filtroFavoritas
    ? motivacionesFiltradas.filter((m) => m.esFavorita)
    : motivacionesFiltradas;

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

      {/* 🔹 Filtro con búsqueda por palabra clave y favoritas */}
      <FiltrosMotivaciones
        motivaciones={motivaciones} // 👈 Se pasa la lista completa
        onResultados={setMotivacionesFiltradas} // 👈 Recibe resultados filtrados
        filtroFavoritas={filtroFavoritas}
        setFiltroFavoritas={setFiltroFavoritas}
      />

      {/* 🔹 Mostrar tarjetas filtradas */}
      <div className="motivaciones-grid">
        {listaFinal.map((m) => (
          <TarjetaMotivacion
            key={m.id}
            motivacion={m}
            onFavorita={toggleFavorita}
            onEditar={onEditar}
            onCambiarEstado={() => toggleEstado(m.id, m.activo)}
          />
        ))}
      </div>

      {/* 🔹 Modal de agregar motivación */}
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
