import React from 'react';
import TarjetaPromesa from './TarjetaPromesa';
import './ListaPromesas.css';

const ListaPromesas = ({ 
  promesas, 
  onRegistrarFallo, 
  onFinalizarPromesa,
  onReactivarPromesa,
  onEditarPromesa, 
  onEliminarPromesa, 
  onSeleccionarPromesa,
  promesaSeleccionada,
  filtroEstado
}) => {
  if (promesas.length === 0) {
    return (
      <div className="lista-promesas-vacia">
        <h3>
          {filtroEstado === 'activas' 
            ? 'No tienes promesas activas' 
            : 'No tienes promesas finalizadas'
          }
        </h3>
        <p>
          {filtroEstado === 'activas'
            ? 'Crea tu primera promesa para comenzar a trackear tu progreso'
            : 'Las promesas que finalices aparecerán aquí'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="lista-promesas">
      {promesas.map(promesa => (
        <TarjetaPromesa
          key={promesa.id}
          promesa={promesa}
          onRegistrarFallo={onRegistrarFallo}
          onFinalizarPromesa={onFinalizarPromesa}
          onReactivarPromesa={onReactivarPromesa}
          onEditarPromesa={onEditarPromesa}
          onEliminarPromesa={onEliminarPromesa}
          onSeleccionar={() => onSeleccionarPromesa(promesa)}
          isSeleccionada={promesaSeleccionada?.id === promesa.id}
          filtroEstado={filtroEstado}
        />
      ))}
    </div>
  );
};

export default ListaPromesas;