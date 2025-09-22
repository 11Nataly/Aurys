import React, { useState } from 'react';
import { FaPlay, FaFilter, FaHeart, FaTimes } from 'react-icons/fa';
import TecnicasLista from '../components/Afrontamiento/TecnicasLista';
import videoEjemplo from '../components/Afrontamiento/videotecnica.mp4';
import '../../styles/afrontamiento.css';

const Afrontamiento = () => {
  const [tecnicaDetalle, setTecnicaDetalle] = useState(null);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);
  const [mostrarModalVideo, setMostrarModalVideo] = useState(false);
  const [tecnicaVideo, setTecnicaVideo] = useState(null);

  const toggleFiltroFavoritos = () => {
    setMostrarSoloFavoritos(!mostrarSoloFavoritos);
  };

  const abrirModalVideo = (tecnica) => {
    setTecnicaVideo(tecnica);
    setMostrarModalVideo(true);
  };

  const cerrarModalVideo = () => {
    setMostrarModalVideo(false);
    setTecnicaVideo(null);
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
          onShowVideo={abrirModalVideo}
          mostrarSoloFavoritos={mostrarSoloFavoritos}
        />
      </div>

      {/* Modal de detalle de técnica - CON TEXTO Y VIDEO */}
      {tecnicaDetalle && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal modal-detalles">
              <div className="modal-header">
                <h2>{tecnicaDetalle.titulo}</h2>
                <button className="btn-cerrar" onClick={() => setTecnicaDetalle(null)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-content">
                <div className="modal-grid">
                  {/* Columna izquierda - Información de la técnica */}
                  <div className="modal-info">
                    <div className="modal-seccion">
                      <h3>Descripción</h3>
                      <p className="modal-descripcion">{tecnicaDetalle.descripcion}</p>
                    </div>
                    
                    <div className="modal-seccion">
                      <h3>Instrucciones</h3>
                      <ol className="modal-lista">
                        {tecnicaDetalle.pasos && tecnicaDetalle.pasos.map((paso, index) => (
                          <li key={index}>{paso}</li>
                        ))}
                      </ol>
                    </div>
                    
                    {tecnicaDetalle.beneficios && (
                      <div className="modal-seccion">
                        <h3>Beneficios</h3>
                        <ul className="modal-lista">
                          {tecnicaDetalle.beneficios.map((beneficio, index) => (
                            <li key={index}>{beneficio}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Columna derecha - Video */}
                  <div className="modal-video">
                    <div className="modal-seccion">
                      <h3>Video demostrativo</h3>
                      
                      {/* Reproductor de video integrado */}
                      <div className="video-integrado-container">
                        <video 
                          controls 
                          className="video-integrado"
                          autoPlay
                          poster={tecnicaDetalle.imagen || ''}
                        >
                          <source src={videoEjemplo} type="video/mp4" />
                          Tu navegador no soporta el elemento de video.
                        </video>
                      </div>
                      
                      {tecnicaDetalle.duracion && (
                        <div className="duracion-info">
                          <p><strong>Duración:</strong> {tecnicaDetalle.duracion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de video - SOLO VIDEO SIN TEXTO */}
      {mostrarModalVideo && tecnicaVideo && (
        <div className="modal-overlay" onClick={cerrarModalVideo}>
          <div className="modal-container">
            <div className="modal modal-solo-video" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{tecnicaVideo.titulo}</h2>
                <button className="btn-cerrar" onClick={cerrarModalVideo}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-content">
                <div className="video-contenedor-principal">
                  <div className="video-integrado-container grande">
                    <video 
                      controls 
                      className="video-integrado"
                      autoPlay
                      poster={tecnicaVideo.imagen || ''}
                    >
                      <source src={videoEjemplo} type="video/mp4" />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </div>
                  
                  {tecnicaVideo.duracion && (
                    <div className="duracion-info">
                      <p><strong>Duración:</strong> {tecnicaVideo.duracion}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Afrontamiento;