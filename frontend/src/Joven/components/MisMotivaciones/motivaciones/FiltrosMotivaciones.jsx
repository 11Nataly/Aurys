const FiltrosMotivaciones = ({ filtroFavoritas, setFiltroFavoritas }) => {
  return (
    <div className="filtros-barra">
      <input type="text" placeholder="Buscar motivaciones..." />
      <button
        className={filtroFavoritas ? "favorito-activo" : ""}
        onClick={() => setFiltroFavoritas(!filtroFavoritas)}
      >
        Favoritas ♥
      </button>
      <button>Ordenar</button>
    </div>
  );
};

export default FiltrosMotivaciones;
