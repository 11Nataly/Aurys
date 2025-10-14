import { useState } from "react";
import "./categorias.css";

const sugerencias = [
  "Mensajes", "Recuerdos", "Viajes", "Logros",
  "Familia", "Amigos", "Mascotas", "Momentos"
];

const NuevaCategoria = ({ onCerrar, onGuardar }) => {
  const [nombre, setNombre] = useState("");

  const handleGuardar = () => {
    if (!nombre.trim()) return alert("Debes ingresar un nombre de categoría");
    const usuario_id = localStorage.getItem("id_usuario") || 1;
    const nuevaCategoria = {
      id: Date.now(),
      usuario_id: parseInt(usuario_id),
      nombre,
      esPredeterminada: 0,
      activo: 1,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };
    onGuardar(nuevaCategoria);
  };

  return (
    <div className="modal-fondo">
      <div className="modal-categoria">
        <div className="modal-header">
          <h3>Nueva categoría</h3>
          <button onClick={onCerrar} className="btn-cerrar">×</button>
        </div>

        <div className="modal-body">
          <label>Nombre de la categoría</label>
          <input
            type="text"
            placeholder="Escribe un nombre o selecciona una sugerencia..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <div className="sugerencias">
            {sugerencias.map((s, i) => (
              <button key={i} onClick={() => setNombre(s)} className="btn-sugerencia">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onCerrar}>Cancelar</button>
          <button className="btn-guardar" onClick={handleGuardar}>
            Crear categoría
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaCategoria;
