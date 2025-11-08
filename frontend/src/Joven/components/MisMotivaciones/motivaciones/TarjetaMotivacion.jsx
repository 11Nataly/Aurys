import { FaHeart, FaRegHeart } from "react-icons/fa";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const TarjetaMotivacion = ({
  motivacion,
  onFavorita,
  onEditar,
  onCambiarEstado, // espera (id, estado)
}) => {
  // seguridad: normalizar esFavorita (acepta 0/1 o boolean)
  const favorita = motivacion?.esFavorita === 1 || motivacion?.esFavorita === true;

  // construir URL segura para la imagen (si no existe, usar placeholder)
  const obtenerSrcImagen = () => {
    const img = motivacion?.imagen;
    if (!img) return `${import.meta.env.VITE_API_URL}/static/motivaciones/placeholder.jpg`; // opcional placeholder
    if (typeof img !== "string") return `${import.meta.env.VITE_API_URL}/static/motivaciones/placeholder.jpg`;
    if (img.startsWith("data:")) return img;
    if (img.startsWith("http")) return img;
    return `${import.meta.env.VITE_API_URL}/static/motivaciones/${img}`;
  };

  return (
    <div className="tarjeta-motivacion">
      {/* Imagen */}
      <div className="img-wrapper">
        <img
          src={obtenerSrcImagen()}
          alt={motivacion?.titulo || "Motivación"}
          className="img-motivacion"
        />
      </div>

      {/* Contenido */}
      <div className="motivacion-info">
        <div className="titulo-favorito">
          <h4>{motivacion?.titulo}</h4>

          <button
            className={`btn-favorito ${favorita ? "esFavorita" : ""}`}
            onClick={() => onFavorita && onFavorita(motivacion.id, favorita)}
            title={favorita ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {favorita ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <p className="descripcion">{motivacion?.descripcion}</p>
      </div>

      {/* Acciones */}
      <div className="acciones">
        <button
          className="btn-editar"
          onClick={() => onEditar && onEditar(motivacion)}
          title="Editar motivación"
        >
          <PencilSquareIcon className="icono-btn" />
          <span>Editar</span>
        </button>

        <button
          className="btn-eliminar-motivacion"
          onClick={() => onCambiarEstado && onCambiarEstado(motivacion.id, motivacion.activo)}
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
