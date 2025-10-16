from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.services import categoria_service
from app.dtos.categoria_dtos import (
    CategoriaCreateDTO,
    CategoriaResponseDTO,
    CategoriaEstadoDTO
)

router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"]
)


# -------------------------------------------------------
# GET - Listar categorías activas por usuario
# -------------------------------------------------------
@router.get("/listar/{usuario_id}", response_model=List[CategoriaResponseDTO])
def listar_categorias(usuario_id: int, db: Session = Depends(get_db)):
    """
    Retorna las categorías activas de un usuario (activo=1).
    """
    return categoria_service.listar_por_usuario(db, usuario_id)


# -------------------------------------------------------
# POST - Agregar nueva categoría (JSON)
# -------------------------------------------------------
@router.post("/agregar", response_model=CategoriaResponseDTO)
def agregar_categoria(dto: CategoriaCreateDTO, db: Session = Depends(get_db)):
    """
    Crea una nueva categoría recibiendo JSON con:
    - usuario_id
    - nombre
    - esPredeterminada (opcional, por defecto False)
    - activo (opcional, por defecto True)
    """
    return categoria_service.agregar_categoria(db, dto)


# -------------------------------------------------------
# PUT - Cambiar estado (activo/inactivo)
# -------------------------------------------------------
@router.put("/{categoria_id}/estado", response_model=CategoriaResponseDTO)
def cambiar_estado_categoria(categoria_id: int, dto: CategoriaEstadoDTO, db: Session = Depends(get_db)):
    """
    Cambia el estado activo de la categoría.
    Si se pasa a 0, desactiva todas las motivaciones asociadas.
    """
    return categoria_service.cambiar_estado_categoria(db, categoria_id, dto)


# -------------------------------------------------------
# GET - Listar nombres e IDs de categorías activas
# -------------------------------------------------------
@router.get("/categorias/{usuario_id}/activas")
def listar_categorias_activas(usuario_id: int, db: Session = Depends(get_db)):
    """
    Lista todas las categorías activas de un usuario.
    """
    return categoria_service.listar_nombres_activos(db, usuario_id)

