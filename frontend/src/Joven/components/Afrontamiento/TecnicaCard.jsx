import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaPlay, FaStar, FaRegStar } from 'react-icons/fa';
import { afrontamientoService } from '../../../services/afrontamientoService';

const TecnicaCard = ({ tecnica, onSelect, onShowVideo, onToggleFavorito }) => {
  const [calificacionUsuario, setCalificacionUsuario] = useState(
    parseInt(localStorage.getItem(`calificacion_${tecnica.id}`) || '0')
  );

  const handleFavorito = () => {
    onToggleFavorito(tecnica.id);
  };

  const handleCalificacion = async (stars) => {
    try {
      await afrontamientoService.calificarTecnica(tecnica.id, stars);
      setCalificacionUsuario(stars);
      localStorage.setItem(`calificacion_${tecnica.id}`, stars.toString());
    } catch (error) {
      console.error('Error al calificar:', error);
    }
  };

  return (
    <div className="tecnica-card">
      <div className="card-header">
        <h3 className="tecnica-titulo">{tecnica.titulo}</h3>
        <div className="duracion-circulo">
          {tecnica.duracion}
        </div>
      </div>

      <div className="card-content">
        <p className="tecnica-descripcion">{tecnica.descripcion}</p>
      </div>

      <div className="card-footer">
        <div className="calificacion-container">
          <div className="estrellas">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star-btn ${star <= calificacionUsuario ? 'active' : ''}`}
                onClick={() => handleCalificacion(star)}
                aria-label={`Calificar con ${star} estrellas`}
              >
                {star <= calificacionUsuario ? <FaStar /> : <FaRegStar />}
              </button>
            ))}
          </div>
          
          <button
            className={`favorito-btn ${tecnica.esFavorito ? 'active' : ''}`}
            onClick={handleFavorito}
            aria-label={tecnica.esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {tecnica.esFavorito ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="acciones-container">
          <button 
            className="btn btn-reproducir"
            onClick={() => onShowVideo(tecnica)}
          >
            <FaPlay /> Reproducir
          </button>
          
          <button 
            className="btn btn-detalles"
            onClick={() => onSelect(tecnica)}
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default TecnicaCard;