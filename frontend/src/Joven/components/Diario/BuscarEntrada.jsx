// src/Joven/components/Diario/BuscarEntrada.jsx
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

const BuscarEntrada = ({ entradas, onResultados }) => {
  const [busqueda, setBusqueda] = useState('');

  // Configuración de Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(entradas, {
      keys: ['titulo', 'contenido'], // Puedes agregar 'fecha' si la formateas
      threshold: 0.4, // 0.0 = exacto, 1.0 = muy tolerante
      includeScore: true,
    });
  }, [entradas]);

  const handleBuscar = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (!valor.trim()) {
      onResultados(entradas);
      return;
    }

    const resultados = fuse.search(valor).map((res) => res.item);
    onResultados(resultados);
  };

  return (
    <div className="buscar-entrada">
      <input
        type="text"
        placeholder="Buscar por título o contenido..."
        value={busqueda}
        onChange={handleBuscar}
        className="input-busqueda"
      />
    </div>
  );
};

export default BuscarEntrada;