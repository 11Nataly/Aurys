import React, { useState, useEffect } from "react";
import "./TrashSection.css";

export default function TrashSection() {
  const [isEmpty, setIsEmpty] = useState(false);
  const [activeTab, setActiveTab] = useState("Promesas");
  const [trashItems, setTrashItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["Promesas", "Entradas de Diario", "Motivaciones"];

  // 🔹 1. Obtener los datos del backend
  useEffect(() => {
    const fetchTrashItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/trash"); 
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setTrashItems(data);
      } catch (error) {
        console.error("Error al cargar papelera:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrashItems();
  }, []);

  // 🔹 2. Restaurar elemento (PUT o POST según tu API)
  const handleRestore = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trash/${id}/restore`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Error al restaurar");
      setTrashItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al restaurar elemento:", error);
    }
  };

  // 🔹 3. Eliminar definitivamente elemento (DELETE)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trash/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      setTrashItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar elemento:", error);
    }
  };

  const toggleTrashView = () => setIsEmpty(!isEmpty);

  // 🔹 4. Agrupar elementos por categoría
  const groupedItems = trashItems.reduce((groups, item) => {
    const cat = item.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
    return groups;
  }, {});

  // 🔹 5. Mostrar estado de carga
  if (loading) {
    return (
      <div className="container">
        <h1>Papelera</h1>
        <p>Cargando elementos...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Papelera</h1>

      {!isEmpty ? (
        <>
          {/* 🔹 Pestañas */}
          <div className="tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${activeTab === cat ? "active" : ""}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 🔹 Contenido de la pestaña activa */}
          <div className="trash-section">
            <div className="category-group">
              <h2 className="category-title">{activeTab}</h2>
              <div className="trash-items">
                {groupedItems[activeTab] && groupedItems[activeTab].length > 0 ? (
                  groupedItems[activeTab].map((item) => (
                    <div key={item.id} className="trash-item">
                      <div className="item-title">{item.title}</div>
                      <div className="item-meta">
                        <div className="meta-left">
                          <span className="item-date">
                            Eliminado: {item.dateDeleted}
                          </span>
                          <span className="item-dae">
                            {item.daysRemaining} días para eliminación permanente
                          </span>
                        </div>
                        <span className="item-type">{item.type}</span>
                      </div>
                      <div className="item-actions">
                        <button
                          className="btn btn-restore"
                          onClick={() => handleRestore(item.id)}
                        >
                          Restaurar
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-category">
                    No hay elementos eliminados en esta sección
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-trash">
          <div className="empty-trash-icon">🗑️</div>
          <div className="empty-trash-message">
            No tienes elementos eliminados por ahora
          </div>
        </div>
      )}

      {/* 🔹 Botón flotante */}
      <button className="btn-trash" onClick={toggleTrashView}>
        {isEmpty ? "Ver elementos eliminados" : "Ver papelera vacía"}
      </button>
    </div>
  );
}
