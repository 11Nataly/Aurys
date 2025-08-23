from pydantic import BaseModel
from typing import Optional

class TecnicaCreateDTO(BaseModel):
    usuario_id: int
    nombre: str
    descripcion: str
    instruccion: str

    class Config:
        orm_mode = True


class TecnicaUpdateDTO(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    instruccion: Optional[str] = None

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
    activo: Optional[bool] # ⚠️ Cambia 'bool' a 'Optional[bool]'

    class Config:
        from_attributes = True


class TecnicaUpdateVideoDTO(BaseModel):
    video: str  # la URL nueva del video