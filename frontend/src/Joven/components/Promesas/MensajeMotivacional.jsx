import React from 'react';
import './MensajeMotivacional.css';

const MensajeMotivacional = ({ promesa, datos }) => {
  // Calcular estadísticas para el mensaje
  const calcularEstadisticas = () => {
    if (promesa.frecuencia === 'diaria') {
      const diasSinFallos = datos.filter(dia => dia.fallos === 0).length;
      const diasConFallos = datos.filter(dia => dia.fallos > 0).length;
      const diasLimiteSuperado = datos.filter(dia => dia.fallos > dia.limite).length;
      const ultimoDia = datos[datos.length - 1];
      
      return {
        diasSinFallos,
        diasConFallos,
        diasLimiteSuperado,
        ultimoDia
      };
    } else {
      const semanasSinFallos = datos.filter(semana => semana.fallos === 0).length;
      const semanasConFallos = datos.filter(semana => semana.fallos > 0).length;
      const semanasLimiteSuperado = datos.filter(semana => semana.fallos > semana.limite).length;
      const ultimaSemana = datos[datos.length - 1];
      
      return {
        semanasSinFallos,
        semanasConFallos,
        semanasLimiteSuperado,
        ultimaSemana
      };
    }
  };

  const generarMensaje = () => {
    const stats = calcularEstadisticas();
    
    if (promesa.frecuencia === 'diaria') {
      const { diasSinFallos, diasConFallos, diasLimiteSuperado, ultimoDia } = stats;
      
      // Mensaje basado en el último día
      if (ultimoDia.fallos === 0) {
        return {
          tipo: 'excelente',
          titulo: '¡Día perfecto! 🎉',
          mensaje: 'Hoy no registraste ningún fallo. ¡Sigue así! Cada día sin recaídas te acerca más a tu meta.',
          emoji: '🌟'
        };
      } else if (ultimoDia.fallos <= ultimoDia.limite) {
        return {
          tipo: 'bueno',
          titulo: '¡Vas por buen camino! 👍',
          mensaje: `Manejaste bien tus fallos hoy (${ultimoDia.fallos}/${ultimoDia.limite}). Recuerda que el progreso no es lineal, lo importante es no rendirse.`,
          emoji: '💪'
        };
      } else {
        return {
          tipo: 'mejorable',
          titulo: '¡Mañana es una nueva oportunidad! 🔄',
          mensaje: `Superaste el límite hoy (${ultimoDia.fallos}/${ultimoDia.limite}). No te desanimes, analiza qué pasó y prepárate para un mejor día mañana.`,
          emoji: '🔄'
        };
      }
    } else {
      // Mensajes para frecuencia semanal
      const { semanasSinFallos, semanasConFallos, semanasLimiteSuperado, ultimaSemana } = stats;
      
      if (ultimaSemana.fallos === 0) {
        return {
          tipo: 'excelente',
          titulo: '¡Semana impecable! 🏆',
          mensaje: 'Una semana completa sin fallos. ¡Eres increíble! Tu consistencia está dando frutos.',
          emoji: '🏆'
        };
      } else if (ultimaSemana.fallos <= ultimaSemana.limite) {
        const porcentaje = Math.round((ultimaSemana.fallos / ultimaSemana.limite) * 100);
        return {
          tipo: 'bueno',
          titulo: '¡Buen manejo esta semana! 📊',
          mensaje: `Usaste el ${porcentaje}% de tus fallos permitidos. El equilibrio es clave para el progreso sostenible.`,
          emoji: '📊'
        };
      } else {
        return {
          tipo: 'mejorable',
          titulo: '¡Ajustemos la estrategia! 🎯',
          mensaje: `Esta semana fue desafiante (${ultimaSemana.fallos}/${ultimaSemana.limite}). Revisa tus triggers y prepárate para la próxima semana.`,
          emoji: '🎯'
        };
      }
    }
  };

  const mensaje = generarMensaje();

  return (
    <div className={`mensaje-motivacional ${mensaje.tipo}`}>
      <div className="mensaje-header">
        <span className="mensaje-emoji">{mensaje.emoji}</span>
        <h3>{mensaje.titulo}</h3>
      </div>
      <p className="mensaje-texto">{mensaje.mensaje}</p>
      
      <div className="estadisticas-rapidas">
        <h4>Tu progreso en números:</h4>
        <div className="estadisticas-grid">
          {promesa.frecuencia === 'diaria' ? (
            <>
              <div className="estadistica">
                <span className="numero">{calcularEstadisticas().diasSinFallos}</span>
                <span className="label">días sin fallos</span>
              </div>
              <div className="estadistica">
                <span className="numero">{promesa.progreso.diasConsecutivos || 0}</span>
                <span className="label">días consecutivos</span>
              </div>
              <div className="estadistica">
                <span className="numero">{promesa.progreso.totalFallos || 0}</span>
                <span className="label">fallos totales</span>
              </div>
            </>
          ) : (
            <>
              <div className="estadistica">
                <span className="numero">{calcularEstadisticas().semanasSinFallos}</span>
                <span className="label">semanas limpias</span>
              </div>
              <div className="estadistica">
                <span className="numero">{promesa.progreso.semanasConsecutivas || 0}</span>
                <span className="label">semanas consecutivas</span>
              </div>
              <div className="estadistica">
                <span className="numero">{promesa.progreso.totalFallos || 0}</span>
                <span className="label">fallos totales</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MensajeMotivacional;