import api from './api';

export const afrontamientoService = {
  getTecnicas: async () => {
    try {
      // En desarrollo, cargar desde el archivo JSON público
      if (import.meta.env.MODE === 'development') {
        const response = await fetch('/data/tecnicas-afrontamiento.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo JSON');
        }
        const data = await response.json();
        
        // Si ya no hay campo icono en el JSON, devolver directamente
        return data.tecnicas;
      }
      
      // En producción, hacer la petición real
      const response = await api.get('/tecnicas-afrontamiento');
      return response.data;
    } catch (error) {
      console.error('Error al cargar técnicas:', error);
      
      // Fallback a datos de ejemplo
      const tecnicasEjemplo = [
        {
          id: 1,
          titulo: "Respiración Profunda",
          duracion: "18 Min",
          descripcion: "Técnica de respiración consciente para reducir el estrés y la ansiedad.",
          esFavorito: false
        },
        {
          id: 2,
          titulo: "Meditación Guiada",
          duracion: "15 Min",
          descripcion: "Meditación con guía audio para alcanzar un estado de calma mental.",
          esFavorito: true
        }
      ];
      return tecnicasEjemplo;
    }
  },

  calificarTecnica: async (tecnicaId, calificacion) => {
    try {
      // En desarrollo, simular envío al servidor
      if (import.meta.env.MODE === 'development') {
        console.log(`Calificando técnica ${tecnicaId} con ${calificacion} estrellas`);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem(`calificacion_${tecnicaId}`, calificacion.toString());
        
        return { success: true };
      }
      
      // En producción, hacer la petición real # Todo ese archivo realizado por douglas   
      const response = await api.post(`/tecnicas/${tecnicaId}/calificar`, { calificacion });
      return response.data;
    } catch (error) {
      console.error('Error al calificar:', error);
      throw new Error('Error al calificar la técnica');
    }
  }
};