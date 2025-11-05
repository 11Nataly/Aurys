from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class PerfilResponseDTO(BaseModel):
    id: int
    nombre: str
    correo: str
    foto_perfil: Optional[str] = None
    fecha_registro: Optional[datetime]
    estado: str

    class Config:
        from_attributes = True  # Cambiado de orm_mode para Pydantic v2


class PerfilUpdateDTO(BaseModel):
    nombre: Optional[str] = None  # Hacer explícito que puede ser None
    correo: Optional[EmailStr] = None
    contrasena: Optional[str] = None  # Asegurar que sea opcional


class PerfilEstadoUpdateDTO(BaseModel):
    activo: bool