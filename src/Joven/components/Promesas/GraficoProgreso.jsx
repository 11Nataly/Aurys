import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { datosGraficoDiario, datosGraficoSemanal } from '../../FakeData/promesasData';
import MensajeMotivacional from './MensajeMotivacional';
import './GraficoProgreso.css';

const GraficoProgreso = ({ promesa }) => {
  const datos = promesa.frecuencia === 'diaria' ? datosGraficoDiario : datosGraficoSemanal;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const fallos = payload[0].value;
      const limite = payload[1]?.value;
      const superaLimite = fallos > limite;

      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Fallos: ${fallos}`}</p>
          <p className="intro">{`Límite: ${limite}`}</p>
          {superaLimite && <p className="limite-superado">¡Límite superado!</p>}
        </div>
      );
    }
    return null;
  };

  // Mensaje fijo debajo del gráfico (como en tu descripción)
  const mensajeFijo = "Hoy fue difícil, pero estás aquí y eso cuenta.";

  return (
    <div className="grafico-progreso">
      <div className="grafico-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={datos} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={promesa.frecuencia === 'diaria' ? 'dia' : 'semana'} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="fallos" 
              fill="#8884d8"
              name="Fallos registrados"
              radius={[6, 6, 0, 0]}
            />
            <Bar 
              dataKey="limite" 
              fill="#82ca9d"
              name="Límite permitido"
              radius={[6, 6, 0, 0]}
              opacity={0.7}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mensaje fijo debajo del gráfico */}
      <div className="mensaje-grafico">
        <p>"{mensajeFijo}"</p>
      </div>

      {/* Componente de mensajes motivacionales (opcional, puedes comentarlo si prefieres solo el mensaje fijo) */}
      {/* <MensajeMotivacional 
        promesa={promesa}
        datos={datos}
      /> */}
    </div>
  );
};

export default GraficoProgreso;