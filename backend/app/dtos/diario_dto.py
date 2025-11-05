from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AgregarDiarioDtos(BaseModel):
    usuario_id: int
    titulo: str 
    contenido: str


class EditarDiarioDto(BaseModel):
    titulo: Optional[str] = None
    contenido: Optional[str] = None


class DiarioResponde(BaseModel):
    usuario_id: int
    titulo: str 
    contenido: str
        

class NotaDiarioBase(BaseModel):
    titulo: str
    contenido: str


class NotaDiarioResponse(NotaDiarioBase):
    id: int
    usuario_id: int
    activo: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
# Todo ese archivo realizado por douglas   