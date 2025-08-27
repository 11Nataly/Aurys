from pydantic import BaseModel
from typing import Optional

class TecnicaCreateDTO(BaseModel):
    usuario_id: int
    nombre: str
    descripcion: str
    instruccion: str
    video: Optional[str] = None
    duracion: Optional[str] = None

    # duración que el admin ingresa
    horas: int = 0
    minutos: int = 0
    segundos: int = 0

    class Config:
        orm_mode = True


class TecnicaUpdateDTO(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    instruccion: Optional[str] = None
    video: Optional[str] = None
    duracion: Optional[str] = None
    horas: Optional[int] = None
    minutos: Optional[int] = None
    segundos: Optional[int] = None

    class Config:
        orm_mode = True



class TecnicaResponseDTO(BaseModel):
    id: int
    usuario_id: int
    nombre: str
    descripcion: Optional[str] = None
    video: Optional[str] = None
    instruccion: Optional[str] = None
    calificacion: Optional[float] = None
    duracion_user: Optional[str] = None  # Se muestra simplificado al usuario
    activo: Optional[bool] # ⚠️ Cambia 'bool' a 'Optional[bool]'

    class Config:
        from_attributes = True


class TecnicaUpdateVideoDTO(BaseModel):
    video: str  # la URL nueva del video