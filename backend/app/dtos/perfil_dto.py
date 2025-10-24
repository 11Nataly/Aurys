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
        orm_mode = True


class PerfilUpdateDTO(BaseModel):
    nombre: Optional[str]
    correo: Optional[EmailStr]
    contrasena: Optional[str]


class PerfilEstadoUpdateDTO(BaseModel):
    activo: bool
