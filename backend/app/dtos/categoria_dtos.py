# backend/app/dtos/categoria_dtos
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoriaBaseDTO(BaseModel):
    """Campos comunes de categoría"""
    nombre: Optional[str] = None
    esPredeterminada: Optional[bool] = False
    activo: Optional[bool] = True


class CategoriaCreateDTO(CategoriaBaseDTO):
    """DTO para crear una categoría"""
    usuario_id: int
    nombre: str


class CategoriaEstadoDTO(BaseModel):
    """DTO para cambiar estado (activo/inactivo)"""
    activo: bool


class CategoriaResponseDTO(CategoriaBaseDTO):
    """DTO para mostrar categorías"""
    id: int
    usuario_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
# Todo ese archivo realizado por douglas   