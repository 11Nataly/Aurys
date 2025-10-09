import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FaTimes, FaWifi, FaRedo, FaSignal } from 'react-icons/fa';

const ReproductorVideo = ({ videoUrl, titulo, onClose }) => {
  const [tieneConexion, setTieneConexion] = useState(navigator.onLine);
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleOnline = () => setTieneConexion(true);
    const handleOffline = () => setTieneConexion(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!tieneConexion) {
    return (
      <div className="modal-overlay">
        <div className="modal modal-solo-video">
          <div className="modal-content">
            <div className="video-error" style={{textAlign: 'center', padding: '40px'}}>
              <FaSignal size={48} style={{color: '#7f8c8d', marginBottom: '20px'}} />
              <h3>Este video requiere conexión a internet</h3>
              <p>Conéctate a internet para poder reproducir el video.</p>
              <button onClick={onClose} className="btn btn-detalles" style={{marginTop: '20px'}}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal modal-solo-video">
          <div className="modal-content">
            <div className="video-error" style={{textAlign: 'center', padding: '40px'}}>
              <h3>No se pudo cargar el video</h3>
              <p>Intenta más tarde o contacta con soporte.</p>
              <div className="acciones-container" style={{justifyContent: 'center', gap: '10px', marginTop: '20px'}}>
                <button onClick={() => setError(false)} className="btn btn-reproducir">
                  <FaRedo /> Reintentar
                </button>
                <button onClick={onClose} className="btn btn-detalles">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-solo-video">
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button onClick={onClose} className="btn-cerrar">
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="video-contenedor-principal">
            <div className="video-integrado-container grande">
              <ReactPlayer
                url={videoUrl}
                controls
                width="100%"
                height="400px"
                onError={() => setError(true)}
                playing={true}
                className="video-integrado"
              />
            </div>
            
            <div className="duracion-info">
              <p><FaWifi /> Conectado y reproduciendo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReproductorVideo;