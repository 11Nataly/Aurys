// src/components/Promesas/GraficoProgreso.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './GraficoProgreso.css';

const GraficoProgreso = ({ promesa }) => {
  const obtenerHistorialFallos = () => {
    // Soporta TODOS los formatos posibles
    const historial = 
      promesa.historial_fallos ||
      promesa.historialFallos ||
      promesa.fallos ||
      promesa.progreso?.historial_fallos ||
      promesa.progreso?.historialFallos ||
      [];

    return Array.isArray(historial) ? historial : [];
  };

  const prepararDatos = () => {
    const historial = obtenerHistorialFallos();
    if (historial.length === 0) {
      return [];
    }

    const limite = promesa.num_maximo_recaidas || promesa.fallos_permitidos || 1;
    const esDiaria = (promesa.frecuencia || '').toLowerCase() === 'diaria';
    const agrupado = {};

    historial.forEach(fallo => {
      const fechaStr = fallo.fecha || fallo.fecha_fallo || fallo.created_at;
      if (!fechaStr) return;

      const fecha = new Date(fechaStr);
      if (isNaN(fecha)) return;

      let clave;
      if (esDiaria) {
        clave = fecha.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' });
      } else if (promesa.frecuencia === 'semanal') {
        const semana = Math.ceil((fecha.getDate() + fecha.getDay()) / 7);
        clave = `Sem ${semana}`;
      } else {
        clave = fecha.toLocaleDateString('es-CO');
      }

      agrupado[clave] = (agrupado[clave] || 0) + 1;
    });

    // Ordenar por fecha
    return Object.entries(agrupado)
      .map(([label, fallos]) => ({ label, fallos, limite }))
      .sort((a, b) => {
        const numA = parseInt(a.label.match(/\d+/)?.[0] || 0);
        const numB = parseInt(b.label.match(/\d+/)?.[0] || 0);
        return numA - numB;
      });
  };
  
  const datos = prepararDatos();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const fallos = payload[0].value;
      const limite = payload[1]?.value;
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p>Fallos: <strong>{fallos}</strong></p>
          <p>Límite: <strong>{limite}</strong></p>
          {fallos > limite && <p className="limite-superado">Límite superado</p>}
        </div>
      );
    }
    return null;
  };

  if (datos.length === 0) {
    return (
      <div className="grafico-progreso">
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No hay datos de fallos aún. Registra tu primer fallo.
        </p>
      </div>
    );
  }

  return (
    <div className="grafico-progreso">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} domain={[0, 'dataMax + 1']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="fallos" fill="#9b59b6" name="Fallos" radius={[6, 6, 0, 0]} />
          <Bar dataKey="limite" fill="#2ecc71" name="Límite" opacity={0.6} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mensaje-grafico">
        <p>"Cada día cuenta. ¡Sigue adelante!"</p>
      </div>
    </div>
  );
};

export default GraficoProgreso;