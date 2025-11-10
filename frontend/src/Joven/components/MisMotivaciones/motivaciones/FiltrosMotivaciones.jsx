// frontend/src/Joven/components/MisMotivaciones/motivaciones/FiltrosMotivaciones.jsx
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import "./motivaciones.css";

const FiltrosMotivaciones = ({
  motivaciones = [],
  onResultados = () => {},
  filtroFavoritas,
  setFiltroFavoritas,
}) => {
  const [busqueda, setBusqueda] = useState("");

  // Configuración de Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(motivaciones, {
      keys: ["titulo", "descripcion"],
      threshold: 0.4,
      includeScore: true,
    });
  }, [motivaciones]);

  const handleBuscar = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (!valor.trim()) {
      onResultados(motivaciones);
      return;
    }

    try {
      const resultados = fuse.search(valor).map((res) => res.item);
      onResultados(resultados);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      onResultados(motivaciones);
    }
  };

  return (
    <div className="filtros-barra">
      <input
        type="text"
        placeholder="Buscar motivaciones por título o descripción..."
        value={busqueda}
        onChange={handleBuscar}
        className="input-buscar-motivacion"
      />

      <button
        className={filtroFavoritas ? "favorito-activo" : "favorito-inactivo"}
        onClick={() => setFiltroFavoritas(!filtroFavoritas)}
      >
        Favoritas
      </button>
    </div>
  );
};

export default FiltrosMotivaciones;
