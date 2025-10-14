import { FaHeart, FaRegHeart, FaPlay, FaStar, FaRegStar } from 'react-icons/fa';
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";


const TarjetaMotivacion = ({ motivacion, onEliminar, onFavorita, onEditar }) => {
  return (
    <div className="tarjeta-motivacion">
      <img
        src={motivacion.imagen}
        alt={motivacion.titulo}
        className="img-motivacion"
      />

      <div className="motivacion-info">
        <div className="titulo-favorito">
          <h4>{motivacion.titulo}</h4>
          <button
            className={`btn-favorito ${motivacion.esFavorita ? "activo" : ""}`}
            onClick={() => onFavorita(motivacion.id)}
            title={motivacion.esFavorita ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {motivacion.esFavorita ? <FaHeart /> : <FaRegHeart />}

          </button>

        </div>
        <p className="descripcion">{motivacion.descripcion}</p>
      </div>

      <div className="acciones">
        <button className="btn-editar" onClick={() => onEditar(motivacion.id)}>
          <PencilSquareIcon className="icono-btn" />
          <span>Editar</span>
        </button>

        <button className="btn-eliminar" onClick={() => onEliminar(motivacion.id)}>
          <TrashIcon className="icono-btn" />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default TarjetaMotivacion;
