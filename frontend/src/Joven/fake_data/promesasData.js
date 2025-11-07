export const promesasData = {
  promesasActivas: [
    {
      id: 1,
      titulo: "No fumar cigarrillos",
      descripcion: "Reducir el consumo de tabaco para mejorar mi salud pulmonar",
      frecuencia: "diaria",
      fallosPermitidos: 2,
      estado: "activa",
      fechaCreacion: "2025-10-01", // Fecha actualizada a 2025
      fechaFinalizacion: "2025-12-31", // Fecha futura en 2025
      progreso: {
        fallosHoy: 1,
        fallosSemana: 3,
        totalFallos: 15,
        diasConsecutivos: 5
      },
      historialFallos: [
        { fecha: "2025-10-14", hora: "14:30", cantidad: 1 },
        { fecha: "2025-10-13", hora: "10:15", cantidad: 2 }
      ]
    },
    {
      id: 2,
      titulo: "Hacer ejercicio 30 minutos",
      descripcion: "Actividad física diaria para mantener un estilo de vida saludable",
      frecuencia: "semanal",
      fallosPermitidos: 1,
      estado: "activa",
      fechaCreacion: "2025-09-28", // Fecha actualizada a 2025
      fechaFinalizacion: "2025-12-31", // Fecha futura en 2025
      progreso: {
        fallosEstaSemana: 0,
        totalFallos: 2,
        semanasConsecutivas: 3
      }
    },
    {
      id: 3,
      titulo: "Leer 20 páginas diarias",
      descripcion: "Cultivar el hábito de la lectura constante",
      frecuencia: "diaria",
      fallosPermitidos: 1,
      estado: "activa",
      fechaCreacion: "2025-10-10", // Fecha actualizada a 2025
      fechaFinalizacion: "2025-12-31", // Fecha futura en 2025
      progreso: {
        fallosHoy: 0,
        fallosSemana: 1,
        totalFallos: 3,
        diasConsecutivos: 7
      }
    }
  ],
  promesasFinalizadas: [
    {
      id: 4,
      titulo: "Beber 2 litros de agua",
      descripcion: "Mantenerme hidratado durante el día",
      frecuencia: "diaria",
      fallosPermitidos: 1,
      estado: "finalizada",
      fechaCreacion: "2025-08-01", // Fecha actualizada a 2025
      fechaFinalizacion: "2025-09-01", // Fecha pasada en 2025 (ya finalizada)
      progreso: {
        totalFallos: 8,
        diasExitosos: 23
      },
      historialFallos: []
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