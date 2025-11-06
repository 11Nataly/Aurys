import { FaHeart, FaRegHeart } from "react-icons/fa";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const TarjetaMotivacion = ({
  motivacion,
  onFavorita,
  onEditar,
  onCambiarEstado, // se usa para desactivar (soft delete)
}) => {
  return (
    <div className="tarjeta-motivacion">
      {/* Imagen */}
      <div className="img-wrapper">
        <img
          src={
            motivacion.imagen?.startsWith("data:")
              ? motivacion.imagen
              : motivacion.imagen?.startsWith("http")
              ? motivacion.imagen
              : `${import.meta.env.VITE_API_URL}/static/motivaciones/${motivacion.imagen}`
          }
          alt={motivacion.titulo}
          className="img-motivacion"
        />
      </div>

      {/* Contenido */}
      <div className="motivacion-info">
        <div className="titulo-favorito">
          <h4>{motivacion.titulo}</h4>

          <button
            className={`btn-favorito ${motivacion.esFavorita ? "activo" : ""}`}
            onClick={() => onFavorita(motivacion.id)}
            title={
              motivacion.esFavorita
                ? "Quitar de favoritos"
                : "Agregar a favoritos"
            }
          >
            {motivacion.esFavorita ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <p className="descripcion">{motivacion.descripcion}</p>
      </div>

      {/* Acciones */}
      <div className="acciones">
        <button
          className="btn-editar"
          onClick={() => onEditar(motivacion)}
          title="Editar motivación"
        >
          <PencilSquareIcon className="icono-btn" />
          <span>Editar</span>
        </button>

        <button
          className="btn-eliminar-motivacion"
          onClick={() => onCambiarEstado(motivacion.id, motivacion.activo)} // cambia el estado (soft delete)
          title="Eliminar motivación"
        >
          <TrashIcon className="icono-btn" />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default TarjetaMotivacion;
