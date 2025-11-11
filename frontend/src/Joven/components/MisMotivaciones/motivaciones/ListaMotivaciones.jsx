import { useEffect, useState, useMemo } from "react";
import TarjetaMotivacion from "./TarjetaMotivacion";
import AgregarMotivacion from "./AgregarMotivacion";
import EditarMotivacion from "./EditarMotivacion";
import FiltrosMotivaciones from "./FiltrosMotivaciones";
import "./motivaciones.css";

import {
  listarMotivaciones,
  crearMotivacion,
  editarMotivacion,
  cambiarEstadoMotivacion,
  favoritosMotivacion,
} from "../../../../services/motivacionService";

const ListaMotivaciones = ({ query, setQuery, categoriaSeleccionada }) => {
  const [motivaciones, setMotivaciones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [motivacionEditando, setMotivacionEditando] = useState(null);
  const [soloFavoritas, setSoloFavoritas] = useState(false);

  const cargarMotivaciones = async () => {
    try {
      const usuario_id = parseInt(localStorage.getItem("id_usuario")) || 1;
      const data = await listarMotivaciones(usuario_id);
      setMotivaciones(data);
      console.log("✅ Motivaciones actualizadas desde backend");
    } catch (error) {
      console.error("Error cargando motivaciones:", error);
    }
  };

  useEffect(() => {
    cargarMotivaciones();
  }, []);

  const handleAgregarMotivacion = async (nueva) => {
    try {
      await crearMotivacion(nueva);
      await cargarMotivaciones();
      setMostrarModal(false);
      console.log("✅ Motivación creada y lista actualizada");
    } catch (error) {
      console.error("Error creando motivación:", error);
    }
  };

  const handleGuardarEdicion = async (motivacionEditada) => {
    try {
      await editarMotivacion(motivacionEditada.id, motivacionEditada);
      await cargarMotivaciones();
      setMotivacionEditando(null);
      console.log("✅ Motivación editada y lista actualizada");
    } catch (error) {
      console.error("Error editando motivación:", error);
    }
  };

  const handleEliminar = async (id, activo) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta motivación?")) return;
    try {
      await cambiarEstadoMotivacion(id, !activo);
      await cargarMotivaciones();
      console.log("✅ Motivación eliminada visualmente y en backend");
    } catch (error) {
      console.error("Error eliminando motivación:", error);
    }
  };

  const handleFavorita = async (id, esFavorita) => {
    try {
      await favoritosMotivacion(id, !esFavorita);
      await cargarMotivaciones();
      console.log("✅ Favorita actualizada");
    } catch (error) {
      console.error("Error actualizando favorita:", error);
    }
  };

  // 🔍 Filtro general (categoría + favoritas + búsqueda)
  const motivacionesFiltradas = useMemo(() => {
    return motivaciones.filter((m) => {
      const matchCategoria =
        !categoriaSeleccionada ||
        Number(m.categoria_id) === Number(categoriaSeleccionada);
      const matchFavorita = !soloFavoritas || m.esFavorita;
      const matchQuery =
        !query ||
        m.titulo.toLowerCase().includes(query.toLowerCase()) ||
        (m.descripcion || "").toLowerCase().includes(query.toLowerCase());
      return matchCategoria && matchFavorita && matchQuery;
    });
  }, [motivaciones, categoriaSeleccionada, soloFavoritas, query]);

  return (
    <div className="motivaciones-panel">
      <div className="motivaciones-header">
        <div>
          <h2>Mis motivaciones</h2>
          <p>Organiza y mantén visibles las razones que te impulsan.</p>
        </div>
        <button
          className="btn-nueva-motivacion"
          onClick={() => setMostrarModal(true)}
        >
          + Nueva motivación
        </button>
      </div>

      <FiltrosMotivaciones
        filtroFavoritas={soloFavoritas}
        setFiltroFavoritas={setSoloFavoritas}
        query={query}
        setQuery={setQuery}
      />

      <div className="motivaciones-grid">
        {motivacionesFiltradas.map((motivacion) => (
          <TarjetaMotivacion
            key={motivacion.id}
            motivacion={motivacion}
            onFavorita={handleFavorita}
            onEditar={setMotivacionEditando}
            onCambiarEstado={handleEliminar}
          />
        ))}
        {motivacionesFiltradas.length === 0 && (
          <p className="sin-resultados">No hay motivaciones para esta categoría</p>
        )}
      </div>

      {mostrarModal && (
        <AgregarMotivacion
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleAgregarMotivacion}
        />
      )}

      {motivacionEditando && (
        <EditarMotivacion
          motivacion={motivacionEditando}
          onCerrar={() => setMotivacionEditando(null)}
          onGuardar={handleGuardarEdicion}
        />
      )}
    </div>
  );
};

export default ListaMotivaciones;
