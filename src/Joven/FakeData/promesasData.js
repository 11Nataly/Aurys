export const promesasData = {
  promesasActivas: [
    {
      id: 1,
      titulo: "No fumar cigarrillos",
      descripcion: "Reducir el consumo de tabaco para mejorar mi salud pulmonar",
      frecuencia: "diaria",
      fallosPermitidos: 2,
      estado: "activa",
      fechaCreacion: "2024-01-15",
      fechaFinalizacion: "2024-02-15",
      progreso: {
        fallosHoy: 1,
        fallosSemana: 3,
        totalFallos: 15,
        diasConsecutivos: 5
      },
      historialFallos: [
        { fecha: "2024-01-20", hora: "14:30", cantidad: 1 },
        { fecha: "2024-01-19", hora: "10:15", cantidad: 2 }
      ]
    },
    {
      id: 2,
      titulo: "Hacer ejercicio 30 minutos",
      descripcion: "Actividad física diaria para mantener un estilo de vida saludable",
      frecuencia: "semanal",
      fallosPermitidos: 1,
      estado: "activa",
      fechaCreacion: "2024-01-10",
      fechaFinalizacion: "2024-03-10",
      progreso: {
        fallosEstaSemana: 0,
        totalFallos: 2,
        semanasConsecutivas: 3
      }
    }
  ],
  promesasFinalizadas: [
    {
      id: 3,
      titulo: "Beber 2 litros de agua",
      descripcion: "Cultivar el hábito de la lectura constante",
      frecuencia: "diaria",
      fallosPermitidos: 1,
      estado: "finalizada",
      fechaCreacion: "2023-12-01",
      fechaFinalizacion: "2024-01-01",
      progreso: {
        totalFallos: 8,
        diasExitosos: 23
      }
    }
  ]
};

export const datosGraficoDiario = [
  { dia: "Lun", fallos: 2, limite: 2 },
  { dia: "Mar", fallos: 1, limite: 2 },
  { dia: "Mié", fallos: 0, limite: 2 },
  { dia: "Jue", fallos: 3, limite: 2 },
  { dia: "Vie", fallos: 1, limite: 2 },
  { dia: "Sáb", fallos: 2, limite: 2 },
  { dia: "Dom", fallos: 0, limite: 2 }
];

export const datosGraficoSemanal = [
  { semana: "Sem 1", fallos: 5, limite: 3 },
  { semana: "Sem 2", fallos: 2, limite: 3 },
  { semana: "Sem 3", fallos: 4, limite: 3 },
  { semana: "Sem 4", fallos: 1, limite: 3 }
];