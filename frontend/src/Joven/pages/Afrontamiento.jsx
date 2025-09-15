import React, { useState } from 'react';
import { FaPlay, FaFilter, FaHeart } from 'react-icons/fa';
import TecnicasLista from '../components/Afrontamiento/TecnicasLista';
import ReproductorVideo from '../components/Afrontamiento/ReproductorVideo';
import '../../styles/afrontamiento.css';

const Afrontamiento = () => {
  const [tecnicaDetalle, setTecnicaDetalle] = useState(null);
  const [videoAbierto, setVideoAbierto] = useState(null);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);

  const toggleFiltroFavoritos = () => {
    setMostrarSoloFavoritos(!mostrarSoloFavoritos);
  };

  return (
    <div>
      <div className="page-header">
        <div className="header-content">
          <div className="header-titles">
            <h1>Técnicas de Afrontamiento</h1>
            <h2>Encuentra tu paz interior</h2>
          </div>
          <button
            className={`filtro-favoritos-btn ${mostrarSoloFavoritos ? 'active' : ''}`}
            onClick={toggleFiltroFavoritos}
          >
            <FaFilter />
            {mostrarSoloFavoritos ? (
              <>
                <FaHeart className="heart-icon" />
                Mostrar todas
              </>
            ) : (
              "Ver favoritas"
            )}
          </button>
        </div>
      </div>

      <div className="page-content">
        <TecnicasLista
          onSelectTecnica={setTecnicaDetalle}
          onShowVideo={setVideoAbierto}
          mostrarSoloFavoritos={mostrarSoloFavoritos}
        />
      </div>

      {/* Modal de detalle de técnica */}
      {tecnicaDetalle && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{tecnicaDetalle.titulo}</h2>
              <button onClick={() => setTecnicaDetalle(null)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="modal-grid">
                <div className="modal-pasos">
                  <h3>Pasos de la Técnica:</h3>
                  <ol className="lista-pasos">
                    {tecnicaDetalle.pasos && tecnicaDetalle.pasos.map((paso, index) => (
                      <li key={index}>{paso}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="modal-video">
                  {tecnicaDetalle.video && (
                    <div className="video-preview">
                      <h3>Video demostrativo</h3>
                      <button
                        className="btn-ver-video"
                        onClick={() => {
                          setTecnicaDetalle(null);
                          setVideoAbierto(tecnicaDetalle);
                        }}
                      >
                        <FaPlay /> Ver video completo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reproductor de video */}
      {videoAbierto && (
        <div className="modal-overlay">
          <ReproductorVideo
            videoUrl={videoAbierto.video}
            titulo={videoAbierto.titulo}
            onClose={() => setVideoAbierto(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Afrontamiento;