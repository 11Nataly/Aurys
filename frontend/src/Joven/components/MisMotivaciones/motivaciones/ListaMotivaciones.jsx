//frontend / src/ joven/ components/MisMotivaciones/motivaciones/listarMotivaciones.jsx
import { useEffect, useState } from "react";
import TarjetaMotivacion from "./TarjetaMotivacion";
import AgregarMotivacion from "./AgregarMotivacion";
import FiltrosMotivaciones from "./FiltrosMotivaciones";
import {
  listarMotivaciones,
  crearMotivacion,
  cambiarEstadoMotivacion,
  favoritosMotivacion
} from "../../../../services/motivacionService";
import "./motivaciones.css";

const ListaMotivaciones = ({
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
    } catch (error) {
      console.error("Error agregando motivación:", error);
    } finally {
      setMostrarModal(false);
    }
  };

  
  // 🔹 Cambiar favorita localmente

  const toggleFavorita = async (id, esFavorita) => {
    try {
      //guardar una nueva favorita, si no, no se guarda
      const nuevaFavorita = !esFavorita;
      await favoritosMotivacion(id, nuevaFavorita);
      //actualiza localmente el estado favorita
       setMotivaciones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, esFavorita: nuevaFavorita } : m
      )
    );
    } catch (error) {
      console.error("Error cambiando a favorito estado:", error);
    }
  };

    // 🔹 Filtro favoritas
  const filtradas = filtroFavoritas
    ? motivaciones.filter((m) => m.esFavorita)
    : motivaciones;

  // 🔹 Cambiar estado activo/inactivo (PUT al backend - soft delete)
  const toggleEstado = async (id, estadoActual) => {
    try {
      await cambiarEstadoMotivacion(id, !estadoActual);
      setMotivaciones((prev) =>
        prev.filter((m) => (estadoActual ? m.id !== id : true))
      );
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  

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
            onFavorita={toggleFavorita}
            onEditar={onEditar}
            onCambiarEstado={() => toggleEstado(m.id, m.activo)} // usa la función definida arriba
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
