from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# DTO para crear una técnica favorita
class TecnicaFavoritaCreate(BaseModel):
    usuario_id: int
    tecnica_id: int


# Response DTO con detalles de la técnica
class TecnicaFavoritaResponse(BaseModel):
    usuario_id: int
    tecnica_id: int
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    video: Optional[str] = None
    instruccion: Optional[str] = None
    duracion_user: Optional[str] = None
    activo: Optional[bool] = None

    class Config:
        from_attributes = True
    
