import React, { useState, useEffect } from 'react';
import TecnicaCard from './TecnicaCard';
import { afrontamientoService } from '../../../services/afrontamientoService';
import { FaHeart, FaFilter } from 'react-icons/fa';

const TecnicasLista = ({ onSelectTecnica, onShowVideo, mostrarSoloFavoritos }) => {
  const [tecnicas, setTecnicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTecnicas();
  }, []);

  const cargarTecnicas = async () => {
    try {
      setLoading(true);
      const data = await afrontamientoService.getTecnicas();
      // Marcar favoritos desde localStorage
      const tecnicasConFavoritos = data.map(tecnica => ({
        ...tecnica,
        esFavorito: localStorage.getItem(`favorito_${tecnica.id}`) === 'true'
      }));
      setTecnicas(tecnicasConFavoritos);
    } catch (err) {
      setError('Error al cargar las técnicas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorito = (tecnicaId) => {
    const updated = tecnicas.map(tecnica =>
      tecnica.id === tecnicaId
        ? { ...tecnica, esFavorito: !tecnica.esFavorito }
        : tecnica
    );
    setTecnicas(updated);
    localStorage.setItem(`favorito_${tecnicaId}`, updated.find(t => t.id === tecnicaId).esFavorito);
  };

  // Filtrar técnicas si mostrarSoloFavoritos es true
  const tecnicasFiltradas = mostrarSoloFavoritos
    ? tecnicas.filter(tecnica => tecnica.esFavorito)
    : tecnicas;

  if (loading) return <div className="loading">Cargando técnicas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tecnicas-lista">
      {mostrarSoloFavoritos && tecnicasFiltradas.length > 0 && (
        <div className="filtro-activo">
          <FaHeart /> Mostrando solo técnicas favoritas
        </div>
      )}
      
      <div className="tecnicas-grid">
        {tecnicasFiltradas.map(tecnica => (
          <TecnicaCard
            key={tecnica.id}
            tecnica={tecnica}
            onSelect={onSelectTecnica}
            onShowVideo={onShowVideo}
            onToggleFavorito={toggleFavorito}
          />
        ))}
      </div>

      {tecnicasFiltradas.length === 0 && (
        <div className={`empty-state ${mostrarSoloFavoritos ? 'favoritos' : ''}`}>
          {mostrarSoloFavoritos
            ? 'No tienes técnicas favoritas. ¡Marca algunas con el corazón!'
            : 'No hay técnicas disponibles'}
        </div>
      )}
    </div>
  );
};

export default TecnicasLista;