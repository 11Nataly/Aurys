from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MotivacionBaseDTO(BaseModel):
    """Campos comunes para creación y actualización"""
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    id_categoria: Optional[int] = None


class MotivacionCreateDTO(MotivacionBaseDTO):
    """DTO para crear una motivación"""
    titulo: str
    descripcion: str
    id_categoria: int
    id_usuario: int


class MotivacionUpdateDTO(MotivacionBaseDTO):
    """DTO para editar motivación existente"""
    pass


class MotivacionResponseDTO(MotivacionBaseDTO):
    """DTO para respuestas al cliente"""
    id: int
    id_usuario: int
    id_categoria: int
    imagen: Optional[str] = None
    estado: bool
    me_gusta: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
