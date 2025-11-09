# app/dtos/promesa_dtos.py
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
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

class ProgresoDTO(BaseModel):
    fallosHoy: int = 0
    fallosSemana: int = 0
    totalFallos: int = 0
    diasConsecutivos: int = 0
    limiteSuperado: Optional[bool] = False

class HistorialFalloItemDTO(BaseModel):
    fecha: str
    hora: str
    cantidad: int

class PromesaResponseDTO(PromesaBaseDTO):
    id: int
    usuario_id: int
    created_at: datetime
    updated_at: datetime
    estado: str  # calculado dinámicamente: 'En progreso', 'Finalizada', 'En papelera'
    progreso: ProgresoDTO
    historialFallos: Optional[List[HistorialFalloItemDTO]] = []

    class Config:
        orm_mode = True
