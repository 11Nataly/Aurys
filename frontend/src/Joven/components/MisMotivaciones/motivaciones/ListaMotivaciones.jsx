//frontend / src/ joven/ components/MisMotivaciones/motivaciones/listarMotivaciones.jsx
import { useEffect, useState } from "react";
import TarjetaMotivacion from "./TarjetaMotivacion";
import AgregarMotivacion from "./AgregarMotivacion";
import EditarMotivacion from "./EditarMotivacion";
import FiltrosMotivaciones from "./FiltrosMotivaciones";
import {
  listarMotivaciones,
  crearMotivacion,
  cambiarEstadoMotivacion,
  favoritosMotivacion,
  editarMotivacion
} from "../../../../services/motivacionService";
import "./motivaciones.css";

const ListaMotivaciones = ({
  onEditar,
  onRequestAgregar,
  query,
  setQuery,
}) => {
  const [motivaciones, setMotivaciones] = useState([]);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [motivacionSeleccionada, setMotivacionSeleccionada] = useState(null);
  const [filtroFavoritas, setFiltroFavoritas] = useState(false);
  const [categorias, setCategorias] = useState([]);

  // 🔹 Cargar categorías y motivaciones al montar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [cats, motivs] = await Promise.all([
          listarCategoriasActivas(),
          listarMotivaciones(),
        ]);
        setCategorias(cats);
        setMotivaciones(motivs);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    cargarDatos();
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

  // 🔹 Editar motivación existente
  const handleEditar = (motivacion) => {
    setMotivacionSeleccionada(motivacion);
    setMostrarModalEditar(true);
  };

  const guardarEdicion = async (motivacionEditada) => {
    try {
      await editarMotivacion(motivacionEditada.id, motivacionEditada);
      const data = await listarMotivaciones();
      setMotivaciones(data);
      setMostrarModalEditar(false);
      setMotivacionSeleccionada(null);
    } catch (error) {
      console.error("Error actualizando motivación:", error);
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
            onEditar={() => handleEditar(m)}
            onCambiarEstado={() => toggleEstado(m.id, m.activo)} // usa la función definida arriba
          />
        ))}
      </div>

          {/* Modal para agregar motivación */}
      {mostrarModalAgregar && (
        <AgregarMotivacion
          onCerrar={() => setMostrarModalAgregar(false)}
          onGuardar={agregarMotivacion}
          categorias={categorias}
        />
      )}

       {/* Modal para agregar motivación */}
      {mostrarModalAgregar && (
        <AgregarMotivacion
          onCerrar={() => setMostrarModalAgregar(false)}
          onGuardar={agregarMotivacion}
          categorias={categorias}
        />
      )}

      {/* Modal para editar motivación */}
      {mostrarModalEditar && motivacionSeleccionada && (
        <EditarMotivacion
          motivacion={motivacionSeleccionada}
          onCerrar={() => setMostrarModalEditar(false)}
          onGuardar={guardarEdicion}
          categorias={categorias}
        />
      )}
    </div>
  );
};

export default ListaMotivaciones;