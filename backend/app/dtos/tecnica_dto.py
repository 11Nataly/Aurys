from pydantic import BaseModel, Field
from typing import Optional,  List

# -------------------------------
# DTOs para Técnicas de Afrontamiento
# -------------------------------

class TecnicaCreateDTO(BaseModel):
    usuario_id: int
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
    video: Optional[str] = None
    duracion: Optional[str] = None
    horas: Optional[int] = None
    minutos: Optional[int] = None
    segundos: Optional[int] = None

    class Config:
        from_attributes = True


class TecnicaResponseDTO(BaseModel):
    id: int
    usuario_id: int
    nombre: str
    descripcion: Optional[str] = None
    video: Optional[str] = None
    instruccion: Optional[str] = None
    calificacion: Optional[int] = None
    duracion_user: Optional[str] = None
    activo: Optional[bool]

    class Config:
        from_attributes = True



class TecnicaUpdateVideoDTO(BaseModel):
    id: int  # ID de la técnica para actualizar el video
    video: str

# -------------------------------
# DTO para devolver las tecnicas con calificacion y favoritos (interfaz)
# -------------------------------
class TecnicaBaseDTO(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    video: Optional[str] = None
    instruccion: Optional[str] = None
    duracion: Optional[str] = None

    class Config:
        from_attributes = True


class TecnicaConEstadoResponseDTO(TecnicaBaseDTO):
    calificacion: Optional[int] = None
    favorita: bool = False
    
# -------------------------------
# DTOs para Calificación
# -------------------------------

class CalificacionCreateDTO(BaseModel):
    tecnica_id: int
    estrellas: int = Field(..., ge=1, le=5, description="Número de estrellas (1 a 5)")

class CalificacionResponseDTO(BaseModel):
    id: int
    nombre: str
    calificacion: Optional[int] = None

    class Config:
        from_attributes = True



class TecnicaAdministrador(BaseModel):
    id: int
    nombre: str
    descripcion: str
    duracion: str


class TecnicaCard(BaseModel):
    id: int
    nombre: str
    video: str
    descripcion: Optional[str] = None
    video: Optional[str] = None
    instruccion: Optional[str] = None
    duracion: Optional[str] = None  
    calificacion: Optional[int] = None
    favorita: bool
    # Todo ese archivo realizado por douglas   