import { useState } from "react";
import "./categorias.css";
import { crearCategoria } from "../../../../services/categoriaService";

// 🔹 Sugerencias que el sistema considera predeterminadas
const sugerencias = [
  "Mensajes", "Recuerdos", "Viajes", "Logros",
  "Familia", "Amigos", "Mascotas", "Momentos"
];

const NuevaCategoria = ({ onCerrar, onGuardar }) => {
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert("Debes ingresar un nombre de categoría");
      return;
    }

    // 🔹 Determinar si es una sugerencia predeterminada
    const esPredeterminada = sugerencias.includes(nombre.trim()) ? 1 : 0;
    const usuario_id = parseInt(localStorage.getItem("id_usuario")) || 1;

    const categoriaData = {
      usuario_id,
      nombre: nombre.trim(),
      esPredeterminada,
      activo: 1,
    };

    try {
     setCargando(true);
      await onGuardar(categoriaData); // ✅ ahora el padre se encarga del fetch y errores
      onCerrar();
    } catch (error) {
      console.error("Error creando categoría:", error);
    } finally {
      setCargando(false);
    }
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
            disabled={cargando}
          />

          <div className="sugerencias">
            {sugerencias.map((s, i) => (
              <button
                key={i}
                onClick={() => setNombre(s)}
                className="btn-sugerencia"
                disabled={cargando}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onCerrar} disabled={cargando}>
            Cancelar
          </button>
          <button className="btn-guardar" onClick={handleGuardar} disabled={cargando}>
            {cargando ? "Creando..." : "Crear categoría"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaCategoria;
