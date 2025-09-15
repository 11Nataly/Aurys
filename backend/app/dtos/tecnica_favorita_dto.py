from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TecnicaFavoritaCreate(BaseModel):
    tecnica_id: int

class TecnicaFavoritaResponse(BaseModel):
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
