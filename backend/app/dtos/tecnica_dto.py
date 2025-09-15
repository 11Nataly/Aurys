from pydantic import BaseModel, Field
from typing import Optional

# -------------------------------
# DTOs para Técnicas de Afrontamiento
# -------------------------------

class TecnicaCreateDTO(BaseModel):
    nombre: str
    descripcion: str
    instruccion: str
    video: Optional[str] = None
    duracion: Optional[str] = None
    horas: int = 0
    minutos: int = 0
    segundos: int = 0

    class Config:
        from_attributes = True


class TecnicaUpdateDTO(BaseModel):
    id: int  # ID de la técnica para actualizar
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    instruccion: Optional[str] = None
    video: Optional[str] = None
    duracion: Optional[str] = None
    horas: Optional[int] = None
    minutos: Optional[int] = None
    segundos: Optional[int] = None
    # FIX: se eliminan campos repetidos 
    
    # video: Optional[str] = None
    # duracion: Optional[str] = None
    # horas: Optional[int] = None
    # minutos: Optional[int] = None
    # segundos: Optional[int] = None

    class Config:
        from_attributes = True


class TecnicaResponseDTO(BaseModel):
    id: int
    usuario_id: int
    nombre: str
    descripcion: Optional[str] = None
    video: Optional[str] = None
    instruccion: Optional[str] = None
    # fix: se elimina el campo calificacion porque ya no va en este modelo
    # calificacion: Optional[int] = None
    duracion_user: Optional[str] = None
    activo: Optional[bool]

    class Config:
        from_attributes = True


class TecnicaUpdateVideoDTO(BaseModel):
    id: int  # ID de la técnica para actualizar el video
    video: str


# fix: se elimina DTO de calificación porque ya no es necesario en este modelo
