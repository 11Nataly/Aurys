const FiltrosMotivaciones = ({ filtroFavoritas, setFiltroFavoritas }) => {
  return (
    <div className="filtros-barra">
      <input type="text" placeholder="Buscar motivaciones..." />
      <button
        className={filtroFavoritas ? "favorito-activo" : "favorito-inactivo"}
        onClick={() => setFiltroFavoritas(!filtroFavoritas)}
      >
        Favoritas
      </button>
      {/* ELIMINO EL BOTÓN PARA DEJAR EL MVP <button>Ordenar</button> */}
    </div>
  );
};

export default FiltrosMotivaciones;
