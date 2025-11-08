import api from "./api"; // asegúrate de tener esta línea

// ✅ Obtener elementos de la papelera
export const getTrashItems = async (usuarioId, tipo) => {
  try {
    const response = await api.get(`/papelera/${tipo}/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener elementos de la papelera:", error);
    return [];
  }
};

// ✅ Restaurar un elemento
// ✅ Restaurar un elemento (activo = true)
export const restoreItem = async (tipo, id) => {
  try {
    // Corregimos el tipo según lo que espera el backend
    const singularMap = {
      promesas: "promesa",
      motivaciones: "motivacion",
      categorias: "categoria",
      diario: "diario",
    };

    const endpointTipo = singularMap[tipo];
    if (!endpointTipo) throw new Error(`Tipo inválido para restaurar: ${tipo}`);

    const res = await api.put(`/papelera/restaurar/${endpointTipo}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error al restaurar elemento:", err);
    throw err;
  }
};


// ✅ Eliminar un elemento (ya corregido)
export const deleteItem = async (tipo, id) => {
  try {
    const primaryMap = {
      promesas: `/promesas/${id}`,
      motivaciones: `/motivaciones/${id}`,
      categorias: `/categorias/${id}`,
      diario: `/papelera/eliminar/diario/${id}`,
    };

    const primary = primaryMap[tipo];
    if (!primary) throw new Error(`Tipo inválido para eliminar: ${tipo}`);

    const response = await api.delete(primary);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar ${tipo}:`, error);
    throw error;
  }
};
