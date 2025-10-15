

// frontend/src/Joven/components/MisMotivaciones/motivaciones/FiltrosMotivaciones.jsx
import { useState, useEffect } from "react";
import "./motivaciones.css";

const FiltrosMotivaciones = ({
  filtroFavoritas,
  setFiltroFavoritas,
  query,
  setQuery,
}) => {
  const [busqueda, setBusqueda] = useState(query || "");

  // 🔹 Actualiza el valor global del buscador con un pequeño retraso (mejor UX)
  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery(busqueda);
    }, 300);
    return () => clearTimeout(delay);
  }, [busqueda, setQuery]);

  return (
    <div className="filtros-barra">
      <input
        type="text"
        placeholder="Buscar motivaciones por título o descripción..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
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
