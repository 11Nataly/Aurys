from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MotivacionBaseDTO(BaseModel):
    """Campos comunes para creación y actualización"""
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None


class MotivacionCreateDTO(MotivacionBaseDTO):
    """DTO para crear una motivación"""
    titulo: str
    descripcion: str
    categoria_id: int
    usuario_id: int


class MotivacionUpdateDTO(MotivacionBaseDTO):
    """DTO para editar motivación existente"""
    pass


class MotivacionResponseDTO(MotivacionBaseDTO):
    """DTO para respuestas al cliente"""
    id: int
    usuario_id: int
    categoria_id: int
    imagen: Optional[str] = None
    activo: bool
    esFavorita: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
