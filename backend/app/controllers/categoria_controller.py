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

# Servicio
from app.services.categoria_service import categoria_service

# ============================================================
# CONFIGURACIÓN DEL ROUTER
# ============================================================
router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"]
)


# ============================================================
# ENDPOINTS
# ============================================================

# ------------------------------------------------------------
# GET - Listar categorías activas por usuario
# ------------------------------------------------------------
@router.get("/listar/{usuario_id}", response_model=List[CategoriaResponseDTO])
def listar_categorias(usuario_id: int, db: Session = Depends(get_db)):
    """
    Retorna las categorías activas de un usuario (activo=1).
    """
    return categoria_service.listar_por_usuario(db, usuario_id)


# ------------------------------------------------------------
# POST - Agregar nueva categoría
# ------------------------------------------------------------
@router.post("/agregar", response_model=CategoriaResponseDTO)
def agregar_categoria(dto: CategoriaCreateDTO, db: Session = Depends(get_db)):
    """
    Crea una nueva categoría recibiendo JSON con:
    - usuario_id
    - nombre
    - esPredeterminada (opcional)
    - activo (opcional)
    """
    return categoria_service.agregar_categoria(db, dto)


# ------------------------------------------------------------
# PUT - Cambiar estado (activo/inactivo)
# ------------------------------------------------------------
@router.put("/{categoria_id}/estado", response_model=CategoriaResponseDTO)
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
    return categoria_service.cambiar_estado_categoria(db, categoria_id, dto)


# ------------------------------------------------------------
# GET - Listar nombres e IDs de categorías activas
# ------------------------------------------------------------
@router.get("/{usuario_id}/activas")
def listar_categorias_activas(usuario_id: int, db: Session = Depends(get_db)):
    """
    Lista todas las categorías activas de un usuario (solo ID y nombre).
    """
    return categoria_service.listar_nombres_activos(db, usuario_id)
