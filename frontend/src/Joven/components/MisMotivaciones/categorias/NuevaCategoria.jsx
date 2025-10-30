import { useState } from "react";
import "./categorias.css";
import { crearCategoria } from "../../../../services/categoriaService";

// Array con sugerencias de nombres de categorías,
//  para que el sistema las tome como predeterminadas 
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

    const yaExiste = categorias.some(
      (cat) => cat.nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (yaExiste) {
      alert("Ya existe una categoría con ese nombre");
      return;
    }

    const usuario_id = parseInt(localStorage.getItem("id_usuario")) || 1;

    // 🔹 Detectar si es una sugerencia predeterminada
    const esPredeterminada = sugerencias.includes(nombre) ? 1 : 0;

    const categoriaData = {
      usuario_id,
      nombre,
      esPredeterminada,
      activo: 1,
    };

    try {
      setCargando(true);
      const nuevaCategoria = await crearCategoria(categoriaData);

      // Envía la categoría creada al padre (opcional)
      onGuardar(nuevaCategoria);

      alert("Categoría creada exitosamente");
      onCerrar();
    } catch (error) {
      console.error("Error creando categoría:", error);
      alert(error.message || "No se pudo crear la categoría");
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
