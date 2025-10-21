from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class PromesaBaseDTO(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    tipo_frecuencia: Optional[str] = None
    num_maximo_recaidas: Optional[int] = None
    fecha_fin: Optional[date] = None
    activo: Optional[bool] = True
    cumplida: Optional[bool] = False

class PromesaCreateDTO(PromesaBaseDTO):
    usuario_id: int
    titulo: str

class PromesaUpdateDTO(PromesaBaseDTO):
    pass

class PromesaPapeleraDTO(BaseModel):
    activo: bool  # True -> restaurar, False -> mover a papelera

class PromesaResponseDTO(PromesaBaseDTO):
    id: int
    usuario_id: int
    created_at: datetime
    updated_at: datetime
    estado: str  # calculado dinámicamente
    fallos_registrados: Optional[int] = 0
    fallos_hoy: Optional[int] = 0

    class Config:
        orm_mode = True
