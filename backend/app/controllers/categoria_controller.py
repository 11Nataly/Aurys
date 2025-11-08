
#backend/app/controllers/categoria_controller.py    
# ============================================================
# CONTROLADOR: CATEGORÍAS
# ============================================================
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from typing import List

# Base de datos
from app.db.database import get_db

# DTOs
from app.dtos.categoria_dtos import (
    CategoriaCreateDTO,
    CategoriaResponseDTO,
    CategoriaEstadoDTO
)

# Modelos
from app.models.motivacion import Motivacion  # 🔹 Importar directamente

# Servicio
from app.services.categoria_service import categoria_service

# ============================================================
# CONFIGURACIÓN DEL ROUTER
# ============================================================
router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"]
)


# ------------------------------------------------------------
# GET - Listar categorías activas por usuario
# ------------------------------------------------------------
@router.get("/listar/{usuario_id}", response_model=List[CategoriaResponseDTO])
def listar_categorias(usuario_id: int, db: Session = Depends(get_db)):
    return categoria_service.listar_por_usuario(db, usuario_id)


# ------------------------------------------------------------
# POST - Agregar nueva categoría
# ------------------------------------------------------------
@router.post("/agregar", response_model=CategoriaResponseDTO)
def agregar_categoria(dto: CategoriaCreateDTO, db: Session = Depends(get_db)):
    return categoria_service.agregar_categoria(db, dto)


# ------------------------------------------------------------
# PUT - Cambiar estado (activo/inactivo)
# ------------------------------------------------------------
@router.put("/{categoria_id}/estado")
def cambiar_estado_categoria(
    categoria_id: int,
    dto: CategoriaEstadoDTO,
    db: Session = Depends(get_db)
):
    """
    Cambia el estado activo de la categoría.
    Si se desactiva, desactiva las motivaciones asociadas.
    Si se reactiva, también las vuelve a activar.
    """
    categoria = categoria_service.cambiar_estado_categoria(db, categoria_id, dto)

    motivaciones_afectadas = db.query(Motivacion).filter(
        Motivacion.categoria_id == categoria_id
    ).count()

    return {
        "mensaje": (
            "Categoría reactivada correctamente"
            if dto.activo else
            "Categoría desactivada correctamente"
        ),
        "categoria": categoria.id,
        "motivaciones_afectadas": motivaciones_afectadas
    }


# ------------------------------------------------------------
# GET - Listar nombres e IDs de categorías activas
# ------------------------------------------------------------
@router.get("/{usuario_id}/activas")
def listar_categorias_activas(usuario_id: int, db: Session = Depends(get_db)):
    return categoria_service.listar_nombres_activos(db, usuario_id)


# ------------------------------------------------------------
# PUT - Editar solo el nombre de una categoría
# ------------------------------------------------------------
@router.put("/{categoria_id}/editar-nombre/{usuario_id}", response_model=CategoriaResponseDTO)
def editar_nombre_categoria(
    categoria_id: int,
    usuario_id: int,
    nombre: str,
    db: Session = Depends(get_db)
):
    return categoria_service.editar_nombre(db, categoria_id, usuario_id, nombre)


# ------------------------------------------------------------
# DELETE - Eliminar categoría y sus motivaciones
# ------------------------------------------------------------
@router.delete("/{categoria_id}")
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    return categoria_service.eliminar_categoria(db, categoria_id)
